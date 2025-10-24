import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '@/domain/entity/payment.entity';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: any): Promise<PaymentDocument> {
    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async findOne(id: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findById(id).exec();
  }

  async find(query: any): Promise<PaymentDocument[]> {
    return this.paymentModel.find(query).exec();
  }

  async findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findOne({ stripePaymentIntentId }).exec();
  }

  async update(id: string, update: any): Promise<PaymentDocument | null> {
    return this.paymentModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async findAll(): Promise<PaymentDocument[]> {
    return this.paymentModel.find().exec();
  }
}
