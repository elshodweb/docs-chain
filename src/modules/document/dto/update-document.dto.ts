import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatus } from '../../../schemas/document.schema';

export class UpdateDocumentDto {
  @ApiProperty({
    example: 'Contract #123',
    description: 'The title of the document',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'This is a contract document...',
    description: 'The content of the document',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    enum: DocumentStatus,
    description: 'The status of the document',
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
}
