import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserSchema } from './user.schema';

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ collection: 'documents' })
export class DocumentSchema extends Document {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the document',
  })
  declare _id: Types.ObjectId;

  @ApiProperty({
    example: 'Contract.pdf',
    description: 'The name of the document',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'The MIME type of the document',
  })
  @Prop({ required: true })
  mimeType: string;

  @ApiProperty({
    example: 'https://storage.example.com/documents/contract.pdf',
    description: 'The URL where the document is stored',
  })
  @Prop({ required: true })
  url: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the user who uploaded the document',
  })
  @Prop({ type: Types.ObjectId, ref: 'UserSchema', required: true })
  uploadedBy: Types.ObjectId;

  @ApiProperty({
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
    description: 'The current status of the document',
  })
  @Prop({
    type: String,
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the user who approved the document',
    required: false,
  })
  @Prop({ type: Types.ObjectId, ref: 'UserSchema' })
  approvedBy?: Types.ObjectId;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the document was approved',
    required: false,
  })
  @Prop({ type: Date })
  approvedAt?: Date;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the user who rejected the document',
    required: false,
  })
  @Prop({ type: Types.ObjectId, ref: 'UserSchema' })
  rejectedBy?: Types.ObjectId;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the document was rejected',
    required: false,
  })
  @Prop({ type: Date })
  rejectedAt?: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the document was created',
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the document was updated',
  })
  @Prop({ default: Date.now })
  updatedAt: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the document was deleted',
    required: false,
  })
  @Prop({ type: Date })
  deletedAt?: Date;
}

export const DocumentSchemaFactory = SchemaFactory.createForClass(DocumentSchema);
