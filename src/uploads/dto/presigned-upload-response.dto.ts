import { ApiProperty } from '@nestjs/swagger';

export class PresignedUploadResponseDto {
  @ApiProperty({
    description: 'Temporary signed URL for direct upload to Spaces',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'Final public file URL to save in application DB',
  })
  fileUrl: string;

  @ApiProperty({ description: 'Object key in the bucket' })
  key: string;

  @ApiProperty({
    description: 'Signed URL expiry time in seconds',
    example: 3600,
  })
  expiresIn: number;
}
