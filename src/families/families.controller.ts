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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FamiliesService } from './families.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateFamilyDto } from './dto/create-family.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { RecommendedWorkersQueryDto } from './dto/recommended-workers-query.dto';
import { JobPostingStatus, Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

type AuthenticatedRequest = {
  user?: {
    userId?: number;
    sub?: number;
  };
};

@ApiTags('Families')
@Controller('families')
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all families' })
  @ApiResponse({ status: 200, description: 'List of families' })
  async findAll(@Query() pagination: PaginationQueryDto) {
    return this.familiesService.findAll(pagination);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create family profile' })
  @ApiResponse({ status: 201, description: 'Family created' })
  async create(@Body() dto: CreateFamilyDto) {
    return this.familiesService.create(dto.userId, dto);
  }

  // Job Posting endpoints
  @Get('job-postings')
  @ApiOperation({ summary: 'Get all job postings' })
  @ApiResponse({ status: 200, description: 'List of job postings' })
  async findAllJobPostings(
    @Query() pagination: PaginationQueryDto,
    @Query('status') status?: JobPostingStatus,
  ) {
    return this.familiesService.findAllJobPostings(pagination, status);
  }

  @Get('job-postings/:id')
  @ApiOperation({ summary: 'Get job posting by ID' })
  @ApiResponse({ status: 200, description: 'Job posting found' })
  @ApiResponse({ status: 404, description: 'Job posting not found' })
  async findJobPostingById(@Param('id') id: string) {
    return this.familiesService.findJobPostingById(parseInt(id, 10));
  }

  @Get('job-postings/:id/recommended-workers')
  @ApiOperation({ summary: 'Get recommended workers for a job posting' })
  @ApiResponse({ status: 200, description: 'Recommended workers list' })
  @ApiResponse({ status: 404, description: 'Job posting not found' })
  async getRecommendedWorkers(
    @Param('id') id: string,
    @Query() query: RecommendedWorkersQueryDto,
  ) {
    return this.familiesService.getRecommendedWorkers(parseInt(id, 10), query);
  }

  @Post('job-postings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.FAMILY)
  @ApiOperation({ summary: 'Create new job posting' })
  @ApiResponse({ status: 201, description: 'Job posting created' })
  async createJobPosting(
    @Body() dto: CreateJobPostingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return this.familiesService.createJobPosting(userId, dto);
  }

  @Post('job-postings/:id/close')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Close job posting' })
  @ApiResponse({ status: 200, description: 'Job posting closed' })
  async closeJobPosting(@Param('id') id: string) {
    return this.familiesService.updateJobPostingStatus(
      parseInt(id, 10),
      'CLOSED',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get family by ID' })
  @ApiResponse({ status: 200, description: 'Family found' })
  @ApiResponse({ status: 404, description: 'Family not found' })
  async findById(@Param('id') id: string) {
    return this.familiesService.findById(parseInt(id));
  }
}
