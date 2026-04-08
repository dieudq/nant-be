import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateTrainingAttemptDto {
  @ApiProperty({
    example: 'Basic Infant Care 101',
    description: 'Training course name shown to workers',
  })
  @IsString()
  courseName: string;

  @ApiProperty({
    example: 85,
    description: 'Training test score in percentage',
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;
}
