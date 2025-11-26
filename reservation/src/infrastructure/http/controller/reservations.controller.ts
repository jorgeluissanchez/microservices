import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ReservationsService } from '../../../application/service/reservations.service';
import {
  CreateReservationDto,
  ChangeReservationStatusDto,
  ReservationResponseDto
} from '../../../application/dto/create-reservation.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  @ApiOperation({
    summary: 'Crear reservación pendiente desde un lugar',
    description: 'Crea una nueva reservación en estado PENDING a partir de un ID de lugar válido'
  })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({
    status: 201,
    description: 'Reservación creada exitosamente',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado' })
  async createReservationFromPlace(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: any,
  ): Promise<ReservationResponseDto> {
    // Obtener userId del header personalizado enviado por el API Gateway
    const userId = req.headers['x-user-id'] || 'mock-user-id';
    console.log('Reservation Service: Received userId from header:', userId);

    const reservation = await this.reservationsService.createPendingReservation(
      createReservationDto,
      userId,
    );
    return this.mapToResponseDto(reservation);
  }

  @Get('user/me')
  @ApiOperation({
    summary: 'Obtener reservaciones del usuario',
    description: 'Obtiene todas las reservaciones del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservaciones del usuario',
    type: [ReservationResponseDto],
  })
  async getUserReservations(@Req() req: any): Promise<ReservationResponseDto[]> {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      // Fallback for local testing if gateway doesn't pass header
      // In production this should probably throw Unauthorized
      console.warn('No user ID found in headers');
      return [];
    }
    const reservations = await this.reservationsService.getUserReservations(userId);
    return reservations.map(r => this.mapToResponseDto(r));
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Cambiar estado de reservación',
    description: 'Cambia el estado de una reservación existente. Estados disponibles: PENDING, CONFIRMED, CANCELLED, REJECTED'
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación' })
  @ApiBody({ type: ChangeReservationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Estado de reservación actualizado exitosamente',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 400, description: 'Estado inválido o no se puede cambiar' })
  async changeReservationStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeReservationStatusDto,
  ): Promise<ReservationResponseDto> {
    const { status, reason } = changeStatusDto;

    let reservation;
    switch (status) {
      case 'CONFIRMED':
        reservation = await this.reservationsService.confirmReservation(id, 'payment-id');
        break;
      case 'CANCELLED':
        reservation = await this.reservationsService.cancelReservation(id, 'mock-user-id');
        break;
      case 'REJECTED':
        reservation = await this.reservationsService.rejectReservation(id, reason || 'No reason provided');
        break;
      default:
        throw new Error('Invalid status');
    }

    return this.mapToResponseDto(reservation);
  }


  private mapToResponseDto(reservation: any): ReservationResponseDto {
    return {
      id: reservation.id || reservation._id?.toString(),
      placeId: reservation.placeId,
      userId: reservation.userId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      amount: reservation.amount,
      currency: reservation.currency,
      customerEmail: reservation.customerEmail,
      status: reservation.status,
      paymentId: reservation.paymentId,
      paymentUrl: reservation.paymentUrl,
      timestamp: reservation.timestamp,
      confirmedAt: reservation.confirmedAt,
      cancelledAt: reservation.cancelledAt,
      rejectedAt: reservation.rejectedAt,
      rejectionReason: reservation.rejectionReason,
    };
  }
}