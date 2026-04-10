import { Controller, Get, Post, Param, Body, UseGuards, Query, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
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
  @ApiOperation({ summary: 'Create worker profile' })
  @ApiResponse({ status: 201, description: 'Worker created' })
  async createWorkerProfile(@Body() dto: CreateWorkerDto, @Request() req) {
    return this.usersService.createWorkerProfile(req.user.userId, dto);
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
  @ApiOperation({ summary: 'Attach compliance document to worker profile' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded metadata created',
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
