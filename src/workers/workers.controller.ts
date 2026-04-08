import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateWorkerDocumentDto } from './dto/create-worker-document.dto';
import { CreateTrainingAttemptDto } from './dto/create-training-attempt.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';

@ApiTags('Workers')
@Controller('workers')
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all approved workers' })
  @ApiResponse({ status: 200, description: 'List of workers' })
  async findAll() {
    return this.workersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get worker by ID' })
  @ApiResponse({ status: 200, description: 'Worker found' })
  @ApiResponse({ status: 404, description: 'Worker not found' })
  async findById(@Param('id') id: string) {
    return this.workersService.findById(parseInt(id, 10));
  }

  @Get('pending')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get pending worker approvals' })
  @ApiResponse({ status: 200, description: 'Pending workers' })
  async getPending() {
    return this.workersService.getPending();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create worker profile' })
  @ApiResponse({ status: 201, description: 'Worker created' })
  async create(@Body() data: any) {
    return this.workersService.create(data.userId, data);
  }

  @Post(':id/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Approve worker' })
  @ApiResponse({ status: 200, description: 'Worker approved' })
  async approve(@Param('id') id: string) {
    return this.workersService.approve(parseInt(id, 10));
  }

  @Post(':id/reject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reject worker' })
  @ApiResponse({ status: 200, description: 'Worker rejected' })
  async reject(@Param('id') id: string) {
    return this.workersService.reject(parseInt(id, 10));
  }

  @Post(':id/documents')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Attach compliance document to worker profile' })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded metadata created',
  })
  async createDocument(
    @Param('id') id: string,
    @Body() dto: CreateWorkerDocumentDto,
  ) {
    return this.workersService.createDocument(parseInt(id, 10), dto);
  }

  @Get(':id/documents')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get worker compliance documents' })
  @ApiResponse({ status: 200, description: 'Worker documents' })
  async getDocuments(@Param('id') id: string) {
    return this.workersService.getDocuments(parseInt(id, 10));
  }

  @Post(':id/training-attempts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit worker training test result' })
  @ApiResponse({ status: 201, description: 'Training attempt stored' })
  async createTrainingAttempt(
    @Param('id') id: string,
    @Body() dto: CreateTrainingAttemptDto,
  ) {
    return this.workersService.createTrainingAttempt(parseInt(id, 10), dto);
  }

  @Post(':id/interviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Schedule 2:1 interview between family and worker' })
  @ApiResponse({ status: 201, description: 'Interview session created' })
  async scheduleInterview(
    @Param('id') id: string,
    @Body() dto: ScheduleInterviewDto,
  ) {
    return this.workersService.scheduleInterview(parseInt(id, 10), dto);
  }
}
