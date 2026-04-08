import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.family.findMany({
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
    return this.prisma.family.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async create(userId: number, data: any) {
    return this.prisma.family.create({
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
    return this.prisma.family.update({
      where: { id },
      data,
    });
  }
}
