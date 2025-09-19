import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, type ObjectId } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: ObjectId;
}
