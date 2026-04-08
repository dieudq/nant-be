import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookingsService.findById(parseInt(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any) {
    return this.bookingsService.create(data);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirm(@Param('id') id: string) {
    return this.bookingsService.updateStatus(parseInt(id), 'CONFIRMED');
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(parseInt(id));
  }
}
