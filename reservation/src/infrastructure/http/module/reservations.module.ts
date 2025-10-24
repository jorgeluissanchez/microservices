import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from '@/application/service/reservations.service';
import { ReservationsController } from '@/infrastructure/http/controller/reservations.controller';
import { ReservationsRepository } from '@/infrastructure/repository/reservations.repository';
import { Reservation, ReservationSchema } from '@/domain/entity/reservation.entity';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/reservations_db'
    ),
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}