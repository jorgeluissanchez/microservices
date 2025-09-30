import { map } from 'rxjs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { ReservationsRepository } from '@/infrastructure/repository/reservations.repository';
import { CreateReservationDto } from '@/application/dto/create-reservation.dto';
import { UpdateReservationDto } from '@/application/dto/update-reservation.dto';
import { PAYMENTS_SERVICE } from '@/libs/common/src/constants/service';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly payment_service: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.payment_service
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map(async (res) => {
          return this.reservationsRepository.create({
            ...createReservationDto,
            timestamp: new Date(),
            invoiceId: res.id,
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(id: string) {
    return this.reservationsRepository.findOne({ id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}