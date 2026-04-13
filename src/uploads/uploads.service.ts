import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { CreatePresignedUploadDto } from './dto/create-presigned-upload.dto';

@Injectable()
export class UploadsService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cdnBaseUrl?: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('DO_SPACES_ENDPOINT');
    const key = this.configService.get<string>('DO_SPACES_KEY');
    const secret = this.configService.get<string>('DO_SPACES_SECRET');

    this.region = this.configService.get<string>('DO_SPACES_REGION') ?? 'sgp1';
    this.bucket = this.configService.get<string>('DO_SPACES_BUCKET') ?? '';
    this.cdnBaseUrl =
      this.configService.get<string>('DO_SPACES_CDN') ?? undefined;

    if (!endpoint || !key || !secret || !this.bucket) {
      throw new Error('Missing DigitalOcean Spaces configuration');
    }

    this.s3 = new S3Client({
      region: this.region,
      endpoint,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
      },
    });
  }

  async createPresignedUploadUrl(dto: CreatePresignedUploadDto) {
    const expiresInRaw =
      this.configService.get<string>('UPLOAD_URL_EXPIRES') ?? '300';
    const expiresIn = Number.parseInt(expiresInRaw, 10);
    if (Number.isNaN(expiresIn) || expiresIn <= 0) {
      throw new BadRequestException(
        'UPLOAD_URL_EXPIRES must be a positive number',
      );
    }

    const folder = this.normalizeFolder(dto.folder ?? 'uploads');
    const key = `${folder}/${Date.now()}-${randomUUID()}-${this.sanitizeFilename(dto.filename)}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.contentType,
      ACL: 'public-read',
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn });

    const fileUrl = this.cdnBaseUrl
      ? `${this.cdnBaseUrl.replace(/\/$/, '')}/${key}`
      : `https://${this.bucket}.${this.region}.digitaloceanspaces.com/${key}`;

    return {
      uploadUrl,
      fileUrl,
      key,
      expiresIn,
    };
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9._-]/g, '');
  }

  private normalizeFolder(folder: string): string {
    return folder.replace(/^\/+|\/+$/g, '');
  }
}
