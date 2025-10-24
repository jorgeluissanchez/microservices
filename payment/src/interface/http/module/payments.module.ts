import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from '../../../application/service/payments.service';
import { PaymentsController } from '../controller/payments.controller';
import { PaymentsRepository } from '../../../infrastructure/repository/payments.repository';
import { Payment, PaymentSchema } from '../../../domain/entity/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/payments_db'
    ),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
