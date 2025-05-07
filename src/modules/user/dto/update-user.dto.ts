import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../schemas/user.schema';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: false,
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    enum: UserRole,
    description: 'The role of the user',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
