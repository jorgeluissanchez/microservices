import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AbstractRepository } from '@/libs/common/src/database/abstract.repository';
import { Reservation } from '@/domain/entity/reservation.entity';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationsRepository.name);
  constructor(
    @InjectRepository(Reservation)
    protected readonly reservationRepository: Repository<Reservation>,
  ) {
    super(reservationRepository);
  }
}
