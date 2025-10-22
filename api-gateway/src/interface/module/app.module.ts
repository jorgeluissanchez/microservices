import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController, UsersController } from '../controller/auth.controller';
import { PaymentController } from '../controller/payment.controller';
import { ReservationController } from '../controller/reservation.controller';

@Module({
  imports: [HttpModule],
  controllers: [AuthController, UsersController, PaymentController, ReservationController],
})
export class AppModule {}
