import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('workers')
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Get()
  async findAll() {
    return this.workersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.workersService.findById(parseInt(id));
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPending() {
    return this.workersService.getPending();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any) {
    return this.workersService.create(data.userId, data);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approve(@Param('id') id: string) {
    return this.workersService.approve(parseInt(id));
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  async reject(@Param('id') id: string) {
    return this.workersService.reject(parseInt(id));
  }
}
