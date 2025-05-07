import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, QueryOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ collection: 'users' })
export class UserSchema extends Document {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the user',
  })
  declare _id: Types.ObjectId;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: '$2b$10$...',
    description: 'The hashed password of the user',
  })
  @Prop({ required: true })
  passwordHash: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    description: 'The role of the user',
  })
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the user was created',
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-20T12:00:00Z',
    description: 'The date when the user was deleted',
    required: false,
  })
  @Prop({ type: Date })
  deletedAt?: Date;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
