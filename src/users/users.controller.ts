import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { CreateWorkerDocumentDto } from './dto/create-worker-document.dto';
import { CreateTrainingAttemptDto } from './dto/create-training-attempt.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';

type AuthenticatedRequest = {
  user?: {
    userId?: number;
    sub?: number;
  };
};

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() pagination: PaginationQueryDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id));
  }

  // Workers management endpoints moved to /users/workers
  @Get('workers/list')
  @ApiOperation({ summary: 'Get all approved workers' })
  @ApiResponse({ status: 200, description: 'List of workers' })
  async findWorkers(@Query() pagination: PaginationQueryDto) {
    return this.usersService.findWorkers(pagination);
  }

  @Get('workers/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get current worker profile',
    description:
      'Return worker profile for current logged-in user. Useful after create/update profile flow.',
  })
  @ApiResponse({ status: 200, description: 'Worker profile detail' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Worker profile not found' })
  async getMyWorkerProfile(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.userId ?? req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const worker = await this.usersService.getWorkerProfileByUserId(userId);
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    return worker;
  }

  @Get('workers/pending')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get pending worker approvals (Admin only)' })
  @ApiResponse({ status: 200, description: 'Pending workers' })
  async getPendingWorkers() {
    return this.usersService.getPendingWorkers();
  }

  @Post('workers/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create worker profile',
    description:
      'Create profile metadata for current logged-in worker. File upload must be done separately and attached via worker documents API.',
  })
  @ApiBody({
    type: CreateWorkerDto,
    examples: {
      basic: {
        summary: 'Basic profile',
        value: {
          jobTypes: ['BABYSITTING'],
          languages: ['Vietnamese', 'English'],
          services: ['Baby care', 'Light housework'],
          hourlyRate: 100000,
          dailyRate: 800000,
        },
      },
      full: {
        summary: 'Full profile',
        value: {
          employeeCode: 'WK-2026-0001',
          bio: 'Patient, supportive, and experienced with infants.',
          jobTypes: ['BABYSITTING', 'NANNY'],
          languages: ['Vietnamese', 'English'],
          services: ['Feeding', 'Diapering', 'Light housework'],
          hourlyRate: 120000,
          dailyRate: 900000,
          travelRate: 100000,
          nonSmoker: true,
          hasReliableTransportation: true,
          availability: ['Monday', 'Tuesday', 'Wednesday'],
          certifications: ['CPR', 'First Aid'],
          experience: '3 years infant care',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Worker profile created' })
  @ApiBadRequestResponse({
    description: 'Validation error or worker profile already exists',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async createWorkerProfile(
    @Body() dto: CreateWorkerDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return this.usersService.createWorkerProfile(userId, dto);
  }

  @Post('workers/:id/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Approve worker (Admin only)' })
  @ApiResponse({ status: 200, description: 'Worker approved' })
  async approveWorker(@Param('id') id: string) {
    return this.usersService.approveWorker(parseInt(id, 10));
  }

  @Post('workers/:id/reject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reject worker (Admin only)' })
  @ApiResponse({ status: 200, description: 'Worker rejected' })
  async rejectWorker(@Param('id') id: string) {
    return this.usersService.rejectWorker(parseInt(id, 10));
  }

  @Post('workers/:id/documents')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Attach worker document metadata',
    description:
      'Store document/profile file metadata after FE uploads file to cloud storage and receives fileUrl. Use type PROFILE_PHOTO for profile image.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Worker ID' })
  @ApiBody({
    type: CreateWorkerDocumentDto,
    examples: {
      profilePhoto: {
        summary: 'Profile photo metadata',
        value: {
          type: 'PROFILE_PHOTO',
          title: 'Profile photo - front face',
          fileUrl: 'https://cdn.example.com/workers/21/profile.jpg',
          notes: 'Uploaded by FE from worker onboarding',
        },
      },
      idCard: {
        summary: 'ID card metadata',
        value: {
          type: 'ID_CARD_LEVEL_2',
          title: 'CCCD level 2',
          fileUrl: 'https://cdn.example.com/workers/21/cccd.jpg',
          issuedAt: '2024-06-10T00:00:00.000Z',
          expiresAt: '2034-06-10T00:00:00.000Z',
          notes: 'Front + back merged PDF',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Worker document metadata created',
  })
  @ApiBadRequestResponse({
    description: 'Invalid worker id or request payload',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiForbiddenResponse({
    description: 'No permission to upload this worker data',
  })
  async createWorkerDocument(
    @Param('id') id: string,
    @Body() dto: CreateWorkerDocumentDto,
  ) {
    return this.usersService.createWorkerDocument(parseInt(id, 10), dto);
  }

  @Get('workers/:id/documents')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get worker compliance documents' })
  @ApiResponse({ status: 200, description: 'Worker documents' })
  async getWorkerDocuments(@Param('id') id: string) {
    return this.usersService.getWorkerDocuments(parseInt(id, 10));
  }

  @Post('workers/:id/training-attempts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit worker training test result' })
  @ApiResponse({ status: 201, description: 'Training attempt stored' })
  async createTrainingAttempt(
    @Param('id') id: string,
    @Body() dto: CreateTrainingAttemptDto,
  ) {
    return this.usersService.createTrainingAttempt(parseInt(id, 10), dto);
  }

  @Post('workers/:id/interviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Schedule 2:1 interview between family and worker' })
  @ApiResponse({ status: 201, description: 'Interview session created' })
  async scheduleInterview(
    @Param('id') id: string,
    @Body() dto: ScheduleInterviewDto,
  ) {
    return this.usersService.scheduleInterview(parseInt(id, 10), dto);
  }
}
