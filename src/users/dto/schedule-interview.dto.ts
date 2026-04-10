import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class ScheduleInterviewDto {
  @ApiProperty()
  @IsNumber()
  familyId: number;

  @ApiProperty()
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
