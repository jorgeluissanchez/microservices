import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, unique: true })
  stripePaymentIntentId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ 
    type: String, 
    enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED'],
    default: 'PENDING'
  })
  status: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop()
  reservationId?: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
