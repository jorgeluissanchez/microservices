import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationsRepository } from '@/infrastructure/repository/reservations.repository';
import { CreateReservationDto } from '@/application/dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) { }

  async createPendingReservation(createReservationDto: CreateReservationDto, userId: string) {
    // Crear reservación en estado PENDING
    const reservation = await this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      status: 'PENDING',
      userId,
    });

    console.log('Reservation created successfully:', reservation.id);

    // Generar URL de pago automáticamente
    try {
      const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3002';
      const response = await fetch(`${paymentServiceUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: reservation.amount,
          currency: reservation.currency || 'usd',
          description: `Reservación para ${reservation.placeId}`,
          customer_email: reservation.customerEmail,
          reservation_id: reservation.id,
        }),
      });

      if (response.ok) {
        const paymentData = await response.json();
        console.log('Payment URL generated successfully:', paymentData.paymentUrl);

        // Devolver la reservación con la información de pago
        return {
          ...reservation.toObject(),
          paymentId: paymentData.paymentId,
          paymentUrl: paymentData.paymentUrl,
        };
      } else {
        console.error('Error generating payment URL:', response.status);
        // Devolver la reservación sin URL de pago
        return reservation;
      }
    } catch (error) {
      console.error('Error calling payment service:', error);
      // Devolver la reservación sin URL de pago
      return reservation;
    }
  }

  async cancelReservation(id: string, userId: string) {
    const reservation = await this.reservationsRepository.findOne({ _id: id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new BadRequestException('You can only cancel your own reservations');
    }

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestException('Reservation is already cancelled');
    }

    if (reservation.status === 'CONFIRMED') {
      throw new BadRequestException('Cannot cancel a confirmed reservation');
    }

    return this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    );
  }

  async confirmReservation(id: string, paymentId: string) {
    const reservation = await this.reservationsRepository.findOne({ _id: id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== 'PENDING') {
      throw new BadRequestException('Only pending reservations can be confirmed');
    }

    return this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      {
        status: 'CONFIRMED',
        paymentId: paymentId,
        confirmedAt: new Date()
      }
    );
  }

  async rejectReservation(id: string, reason: string) {
    const reservation = await this.reservationsRepository.findOne({ _id: id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.reservationsRepository.findOneAndUpdate(
      { _id: id },
      {
        status: 'REJECTED',
        rejectionReason: reason,
        rejectedAt: new Date()
      }
    );
  }

  async getUserReservations(userId: string) {
    return this.reservationsRepository.findByUserId(userId);
  }

  async findOne(id: string) {
    const reservation = await this.reservationsRepository.findOne({ _id: id });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }
}