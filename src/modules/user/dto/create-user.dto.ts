import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: true,
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    description: 'The role of the user',
    required: false,
  })
  @IsEnum(UserRole)
  role?: UserRole;
}
