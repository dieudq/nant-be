import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'ID của gia đình đặt lịch' })
  @IsInt()
  familyId: number;

  @ApiProperty({ example: 5, description: 'ID của bảo mẫu được đặt' })
  @IsInt()
  workerId: number;

  @ApiProperty({ example: '2026-05-20T00:00:00Z', description: 'Ngày làm việc' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '08:00', description: 'Giờ bắt đầu (HH:mm)' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00', description: 'Giờ kết thúc (HH:mm)' })
  @IsString()
  endTime: string;

  @ApiProperty({ example: 9, description: 'Tổng số giờ làm việc' })
  @IsInt()
  duration: number;

  @ApiProperty({ example: 'BABYSITTING', enum: JobType, description: 'Loại hình dịch vụ' })
  @IsEnum(JobType)
  service: string;

  @ApiProperty({ example: 100000, description: 'Đơn giá mỗi giờ (VND)' })
  @IsNumber()
  rate: number;

  @ApiPropertyOptional({ example: 'Vui lòng đến đúng giờ', description: 'Ghi chú thêm' })
  @IsOptional()
  @IsString()
  notes?: string;
}
