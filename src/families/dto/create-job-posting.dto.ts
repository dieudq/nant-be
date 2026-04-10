import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateFamilyProfileOnFirstJobDto {
  @ApiPropertyOptional({ example: 'B1234567', description: 'Passport number' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiPropertyOptional({ example: '123 Street, District 1, HCMC' })
  @IsOptional()
  @IsString()
  currentAddress?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  numChildren?: number;

  @ApiPropertyOptional({ example: '2 years, 5 years' })
  @IsOptional()
  @IsString()
  childrenAges?: string;

  @ApiPropertyOptional({ example: 'Peanut allergy' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'No TV after 8PM' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ example: 'Need basic English communication' })
  @IsOptional()
  @IsString()
  specialRequirements?: string;
}

export class CreateJobPostingDto {
  @ApiProperty({ example: 'Cần bảo mẫu trông trẻ 2 tuổi', description: 'Title of the job' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Mô tả chi tiết công việc...', description: 'Job description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: JobType, example: JobType.BABYSITTING })
  @IsEnum(JobType)
  @IsNotEmpty()
  jobType: JobType;

  @ApiProperty({ example: 'Quận 1, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  numChildren?: number;

  @ApiPropertyOptional({ example: '2 tuổi' })
  @IsOptional()
  @IsString()
  childrenAges?: string;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  hourlyRateMin?: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  hourlyRateMax?: number;

  @ApiPropertyOptional({ example: '2026-05-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-05-31T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ example: 'Biết tiếng Anh, không hút thuốc' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({
    description:
      'Optional family profile data. If family profile does not exist, it will be created with these fields.',
    type: CreateFamilyProfileOnFirstJobDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateFamilyProfileOnFirstJobDto)
  familyProfile?: CreateFamilyProfileOnFirstJobDto;
}
