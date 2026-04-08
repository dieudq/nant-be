import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkerDocumentType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateWorkerDocumentDto {
  @ApiProperty({
    enum: WorkerDocumentType,
    example: WorkerDocumentType.ID_CARD_LEVEL_2,
    description: 'Type of worker compliance document',
  })
  @IsEnum(WorkerDocumentType)
  type: WorkerDocumentType;

  @ApiPropertyOptional({
    example: 'CCCD level 2 - front side',
    description: 'Display title for admin review',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'https://cdn.example.com/worker-docs/cccd-front.jpg',
    description: 'Public or signed URL of uploaded document',
  })
  @IsUrl()
  fileUrl: string;

  @ApiPropertyOptional({
    example: '2026-01-10T00:00:00.000Z',
    description: 'Issue date of the document',
  })
  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @ApiPropertyOptional({
    example: '2027-01-10T00:00:00.000Z',
    description: 'Expiry date if applicable',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    example: 'Verified against original at office',
    description: 'Internal note for admin/compliance team',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
