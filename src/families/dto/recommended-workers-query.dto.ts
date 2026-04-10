import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class RecommendedWorkersQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of workers returned',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Include workers who already applied to this job posting',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includeApplied?: boolean = false;

  @ApiPropertyOptional({
    description: 'Minimum recommendation score',
    default: 0,
    minimum: 0,
    maximum: 120,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(120)
  minScore?: number = 0;
}
