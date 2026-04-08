import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'worker@example.com',
    description: 'User email address used for login',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Worker@123',
    description: 'User password',
    minLength: 8,
  })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Linh Nanny', description: 'User full name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: '+84 98 765 4321',
    description: 'User phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'WORKER',
    enum: Role,
    description: 'User role, defaults to WORKER if omitted',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
