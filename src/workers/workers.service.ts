import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    return this.prisma.worker.findMany({
      where: {
        isApproved: true,
        ...filters,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.worker.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async create(userId: number, data: any) {
    return this.prisma.worker.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.worker.update({
      where: { id },
      data,
    });
  }

  async getPending() {
    return this.prisma.worker.findMany({
      where: { isApproved: false },
      include: { user: true },
    });
  }

  async approve(id: number) {
    return this.prisma.worker.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async reject(id: number) {
    return this.prisma.worker.delete({
      where: { id },
    });
  }
}
