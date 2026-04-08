import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkerDocumentDto } from './dto/create-worker-document.dto';
import { CreateTrainingAttemptDto } from './dto/create-training-attempt.dto';
import { ScheduleInterviewDto } from './dto/schedule-interview.dto';

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
        documents: true,
        references: true,
        trainingAttempts: {
          orderBy: { takenAt: 'desc' },
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

  async createDocument(workerId: number, dto: CreateWorkerDocumentDto) {
    return this.prisma.workerDocument.create({
      data: {
        workerId,
        type: dto.type,
        title: dto.title,
        fileUrl: dto.fileUrl,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        notes: dto.notes,
      },
    });
  }

  async getDocuments(workerId: number) {
    return this.prisma.workerDocument.findMany({
      where: { workerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTrainingAttempt(workerId: number, dto: CreateTrainingAttemptDto) {
    const passed = dto.score >= 80;

    return this.prisma.$transaction(async (tx) => {
      const attempt = await tx.trainingAttempt.create({
        data: {
          workerId,
          courseName: dto.courseName,
          score: dto.score,
          passed,
        },
      });

      if (passed) {
        await tx.worker.update({
          where: { id: workerId },
          data: { trainingPassed: true },
        });
      }

      return attempt;
    });
  }

  async scheduleInterview(workerId: number, dto: ScheduleInterviewDto) {
    return this.prisma.interviewSession.create({
      data: {
        workerId,
        familyId: dto.familyId,
        scheduledAt: new Date(dto.scheduledAt),
        notes: dto.notes,
      },
    });
  }
}
