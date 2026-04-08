import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateShiftReportDto {
  @ApiProperty({
    example:
      'Fed baby at 8:30, nap from 10:00 to 11:30, reading and drawing session in afternoon.',
    description: 'Main activities completed during the shift',
  })
  @IsString()
  activities: string;

  @ApiPropertyOptional({
    example: 'Mild skin rash noticed after lunch; informed family immediately.',
    description: 'Any incidents that happened during the shift',
  })
  @IsOptional()
  @IsString()
  incidents?: string;

  @ApiPropertyOptional({
    example:
      'Please monitor hydration tonight. Toys and bottles cleaned before handover.',
    description: 'Handover notes for family after shift',
  })
  @IsOptional()
  @IsString()
  handoverNotes?: string;
}
