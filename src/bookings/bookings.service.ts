import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftReportDto } from './dto/create-shift-report.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationQueryDto, filters?: any) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: filters,
        skip,
        take: limit,
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
      }),
      this.prisma.booking.count({ where: filters }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
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

  async create(dto: CreateBookingDto) {
    // Calculate total cost
    const totalCost = dto.duration * dto.rate;

    return this.prisma.booking.create({
      data: {
        ...dto,
        date: new Date(dto.date),
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
