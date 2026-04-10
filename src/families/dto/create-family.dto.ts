import { IsInt, IsString, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty({ example: 2, description: 'User ID của tài khoản gia đình' })
  @IsInt()
  userId: number;

  @ApiPropertyOptional({ example: 'B1234567', description: 'Số hộ chiếu' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiPropertyOptional({ example: '123 Đường ABC, Quận 1, TP.HCM', description: 'Địa chỉ hiện tại' })
  @IsOptional()
  @IsString()
  currentAddress?: string;

  @ApiPropertyOptional({ example: 2, description: 'Số lượng con' })
  @IsOptional()
  @IsInt()
  numChildren?: number;

  @ApiPropertyOptional({ example: '2 tuổi và 5 tuổi', description: 'Độ tuổi của các con' })
  @IsOptional()
  @IsString()
  childrenAges?: string;

  @ApiPropertyOptional({ example: 'Bé lớn 5 tuổi, bé nhỏ 2 tuổi', description: 'Chi tiết về các con' })
  @IsOptional()
  @IsString()
  childrenDetails?: string;

  @ApiPropertyOptional({ example: 'Dị ứng đậu phộng', description: 'Thông tin dị ứng' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Bé lớn hơi nhút nhát', description: 'Ghi chú về tính cách' })
  @IsOptional()
  @IsString()
  personalityNotes?: string;

  @ApiPropertyOptional({ example: 'Không cho xem TV quá 30p', description: 'Hướng dẫn đặc biệt' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ example: 'Cần người biết tiếng Anh cơ bản', description: 'Yêu cầu đặc biệt' })
  @IsOptional()
  @IsString()
  specialRequirements?: string;

  @ApiPropertyOptional({ example: '{"pet": "dog"}', description: 'Sở thích (Chuỗi JSON)' })
  @IsOptional()
  @IsString()
  preferences?: string;
}
