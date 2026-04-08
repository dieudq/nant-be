import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('families')
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  @Get()
  async findAll() {
    return this.familiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.familiesService.findById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any) {
    return this.familiesService.create(data.userId, data);
  }
}
