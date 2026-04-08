import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftReportDto } from './dto/create-shift-report.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    return this.prisma.booking.findMany({
      where: filters,
      include: {
        family: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        worker: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            user: true,
          },
        },
        worker: {
          include: {
            user: true,
          },
        },
        payment: true,
        review: true,
        contract: {
          include: {
            acceptances: true,
          },
        },
        shiftReport: true,
      },
    });
  }

  async create(data: any) {
    // Calculate total cost
    const totalCost = data.duration * data.rate;

    return this.prisma.booking.create({
      data: {
        ...data,
        totalCost,
      },
      include: {
        family: true,
        worker: true,
      },
    });
  }

  async updateStatus(
    id: number,
    status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'PENDING',
  ) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async cancel(id: number) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async createShiftReport(bookingId: number, dto: CreateShiftReportDto) {
    return this.prisma.shiftReport.upsert({
      where: { bookingId },
      update: {
        activities: dto.activities,
        incidents: dto.incidents,
        handoverNotes: dto.handoverNotes,
      },
      create: {
        bookingId,
        activities: dto.activities,
        incidents: dto.incidents,
        handoverNotes: dto.handoverNotes,
      },
    });
  }
}
