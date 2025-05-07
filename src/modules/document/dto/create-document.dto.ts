import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentStatus } from '../../../schemas/document.schema';

export class CreateDocumentDto {
  @ApiProperty({
    example: 'Contract #123',
    description: 'The title of the document',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'This is a contract document...',
    description: 'The content of the document',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
    description: 'The status of the document',
    required: false,
  })
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus = DocumentStatus.PENDING;
}
