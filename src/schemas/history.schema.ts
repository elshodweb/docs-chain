import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum DocumentAction {
  UPLOAD = 'upload',
  APPROVE = 'approve',
  REJECT = 'reject',
  VIEW = 'view',
}

@Schema({ collection: 'history' })
export class HistorySchema extends Document {
  @Prop({ type: Types.ObjectId, ref: 'DocumentSchema', required: true })
  document: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: DocumentAction, required: true })
  action: DocumentAction;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  blockchainTx?: string;
}

export const HistorySchemaFactory = SchemaFactory.createForClass(HistorySchema);
