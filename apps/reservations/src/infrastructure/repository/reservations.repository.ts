import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../../libs/common/src/index';
import { ReservationDocument } from '../../domain/entity/reservation.entity';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);
  constructor(
    @InjectModel(ReservationDocument.name)
    protected readonly reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
  }
}
