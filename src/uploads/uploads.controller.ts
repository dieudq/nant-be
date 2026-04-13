import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';
import { PresignedUploadResponseDto } from './dto/presigned-upload-response.dto';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Generate presigned upload URL for DigitalOcean Spaces',
    description:
      'FE uploads file directly to Spaces using uploadUrl, then saves returned fileUrl in profile/document APIs.',
  })
  @ApiBody({ type: CreatePresignedUploadDto })
  @ApiCreatedResponse({ type: PresignedUploadResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async createPresignedUpload(@Body() dto: CreatePresignedUploadDto) {
    return this.uploadsService.createPresignedUploadUrl(dto);
  }
}
