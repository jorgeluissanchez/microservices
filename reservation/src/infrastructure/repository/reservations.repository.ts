import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from '@/domain/entity/reservation.entity';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
  ) {}

  async create(createReservationDto: any): Promise<ReservationDocument> {
    const reservation = new this.reservationModel(createReservationDto);
    return reservation.save();
  }

  async findOne(query: any): Promise<ReservationDocument | null> {
    return this.reservationModel.findOne(query).exec();
  }

  async findOneAndUpdate(query: any, update: any): Promise<ReservationDocument | null> {
    return this.reservationModel.findOneAndUpdate(query, update, { new: true }).exec();
  }

  async findAll(): Promise<ReservationDocument[]> {
    return this.reservationModel.find().exec();
  }

  async findByUserId(userId: string): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ userId }).exec();
  }

  async findByStatus(status: string): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ status }).exec();
  }
}
