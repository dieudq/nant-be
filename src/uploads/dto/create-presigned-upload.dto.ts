import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreatePresignedUploadDto {
  @ApiProperty({
    example: 'avatar.jpg',
    description: 'Original file name from client',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  filename: string;

  @ApiProperty({
    example: 'image/jpeg',
    description: 'MIME type of the uploaded file',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  contentType: string;

  @ApiPropertyOptional({
    example: 'workers/profile',
    description: 'Optional object key prefix in bucket',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-zA-Z0-9/_-]*$/, {
    message:
      'folder can only contain letters, numbers, slash, underscore, hyphen',
  })
  folder?: string;
}
