import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateWorkerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  employeeCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ enum: JobType, isArray: true, example: ['BABY_CARE', 'ELDERLY_CARE'] })
  @IsArray()
  @IsEnum(JobType, { each: true })
  jobTypes: JobType[];

  @ApiProperty({ example: ['Vietnamese', 'English'] })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ example: ['Cooking', 'Cleaning'] })
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @ApiProperty({ description: 'VND per hour' })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({ description: 'VND per day' })
  @IsNumber()
  dailyRate: number;

  @ApiProperty({ required: false, description: 'VND for travel' })
  @IsNumber()
  @IsOptional()
  travelRate?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  nonSmoker?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  hasReliableTransportation?: boolean;

  @ApiProperty({ required: false, isArray: true, example: ['Monday', 'Tuesday'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availability?: string[];

  @ApiProperty({ required: false, isArray: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experience?: string;
}
