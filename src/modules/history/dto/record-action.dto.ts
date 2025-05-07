import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentAction } from '../../../schemas/history.schema';

export class RecordActionDto {
  @ApiProperty({
    enum: DocumentAction,
    description: 'The action performed on the document',
    example: DocumentAction.UPLOAD,
  })
  @IsNotEmpty()
  @IsEnum(DocumentAction)
  action: DocumentAction;

  @ApiProperty({
    description: 'The ID of the document',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  documentId: string;
}
