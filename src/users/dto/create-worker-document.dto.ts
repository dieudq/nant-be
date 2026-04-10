import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { WorkerDocumentType } from '@prisma/client';

export class CreateWorkerDocumentDto {
  @ApiProperty({ enum: WorkerDocumentType })
  @IsEnum(WorkerDocumentType)
  type: WorkerDocumentType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  issuedAt?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
