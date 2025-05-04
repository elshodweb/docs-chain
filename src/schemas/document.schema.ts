import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserSchema } from './user.schema';

@Schema({ collection: 'documents' })
export class DocumentSchema extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  hash: string;

  @Prop()
  blockchainTx?: string;

  @Prop({ type: Types.ObjectId, ref: 'UserSchema' })
  owner: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DocumentSchemaFactory =
  SchemaFactory.createForClass(DocumentSchema);
