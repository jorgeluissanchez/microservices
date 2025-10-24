import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'usd' })
  currency: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED'],
    default: 'PENDING'
  })
  status: string;

  @Prop()
  paymentId?: string;

  @Prop()
  confirmedAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectionReason?: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);