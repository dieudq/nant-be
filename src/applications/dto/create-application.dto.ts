import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'ID of the job posting' })
  @IsInt()
  @IsNotEmpty()
  jobPostingId: number;

  @ApiProperty({ example: 5, description: 'ID of the worker' })
  @IsInt()
  @IsNotEmpty()
  workerId: number;

  @ApiPropertyOptional({
    example: 'Tôi có 3 năm kinh nghiệm trông trẻ...',
    description: 'Cover letter from worker',
  })
  @IsOptional()
  @IsString()
  coverLetter?: string;
}
