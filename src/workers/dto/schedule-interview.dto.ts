import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class ScheduleInterviewDto {
  @ApiProperty({
    example: 2,
    description: 'Family ID joining the 2:1 interview with marketplace team',
  })
  @IsInt()
  familyId: number;

  @ApiProperty({
    example: '2026-04-20T09:00:00.000Z',
    description: 'Interview schedule in ISO datetime',
  })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({
    example: 'Discuss allergy handling and school pickup routine',
    description: 'Optional agenda for interview',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
