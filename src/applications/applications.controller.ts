import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus, Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Worker apply to a job posting' })
  @ApiResponse({ status: 201, description: 'Application submitted' })
  async apply(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(dto);
  }

  @Get('job-posting/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FAMILY)
  @ApiOperation({
    summary: 'Get all applications for a job posting (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'List of applications' })
  async findByJobPosting(@Param('id') id: string) {
    return this.applicationsService.findByJobPosting(parseInt(id, 10));
  }

  @Get('worker/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all applications of a worker' })
  @ApiResponse({ status: 200, description: 'List of applications' })
  async findByWorker(@Param('id') id: string) {
    return this.applicationsService.findByWorker(parseInt(id, 10));
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get application details' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(parseInt(id, 10));
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update application status (Admin only - Accept/Reject)',
  })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.applicationsService.updateStatus(parseInt(id, 10), status);
  }
}
