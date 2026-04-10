import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateTrainingAttemptDto {
  @ApiProperty()
  @IsString()
  courseName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}
