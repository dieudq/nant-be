import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { JobPostingStatus } from '@prisma/client';
import { RecommendedWorkersQueryDto } from './dto/recommended-workers-query.dto';

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationQueryDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.family.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.family.count(),
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
    if (isNaN(id)) {
      throw new NotFoundException('Invalid family ID');
    }
    return this.prisma.family.findUnique({
      where: { id },
      include: {
        user: true,
        bookings: {
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            worker: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
        reviews: true,
        interviews: true,
        contracts: true,
      },
    });
  }

  async create(userId: number, dto: CreateFamilyDto) {
    return this.prisma.family.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, dto: UpdateFamilyDto) {
    return this.prisma.family.update({
      where: { id },
      data: dto,
    });
  }

  // Job Posting methods
  async createJobPosting(userId: number, dto: CreateJobPostingDto) {
    const { startDate, endDate, familyProfile, ...rest } = dto;

    const family = await this.prisma.family.upsert({
      where: { userId },
      update: familyProfile ?? {},
      create: {
        userId,
        ...(familyProfile ?? {}),
      },
      select: { id: true },
    });

    return this.prisma.jobPosting.create({
      data: {
        ...rest,
        familyId: family.id,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        family: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });
  }

  async findAllJobPostings(
    pagination: PaginationQueryDto,
    status?: JobPostingStatus,
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.jobPosting.findMany({
        where: status ? { status } : {},
        skip,
        take: limit,
        include: {
          family: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
          _count: {
            select: { applications: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.jobPosting.count({
        where: status ? { status } : {},
      }),
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

  async findJobPostingById(id: number) {
    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        family: {
          include: {
            user: {
              select: { name: true, email: true, phone: true },
            },
          },
        },
        applications: {
          include: {
            worker: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!jobPosting) {
      throw new NotFoundException(`Job posting with ID ${id} not found`);
    }

    return jobPosting;
  }

  async updateJobPostingStatus(id: number, status: JobPostingStatus) {
    return this.prisma.jobPosting.update({
      where: { id },
      data: { status },
    });
  }

  async getRecommendedWorkers(
    jobPostingId: number,
    query: RecommendedWorkersQueryDto,
  ) {
    const { limit = 10, includeApplied = false, minScore = 0 } = query;

    const jobPosting = await this.prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
      include: {
        applications: {
          select: { workerId: true },
        },
      },
    });

    if (!jobPosting) {
      throw new NotFoundException(
        `Job posting with ID ${jobPostingId} not found`,
      );
    }

    const appliedWorkerIds = jobPosting.applications.map(
      (item) => item.workerId,
    );

    const workers = await this.prisma.worker.findMany({
      where: {
        isApproved: true,
        jobTypes: {
          has: jobPosting.jobType,
        },
        ...(includeApplied
          ? {}
          : {
              id: {
                notIn: appliedWorkerIds,
              },
            }),
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
      take: 200,
    });

    const recommendationItems = workers
      .map((worker) => {
        const scoreBreakdown = {
          jobType: 40,
          rate: 0,
          trust: 0,
          training: 0,
          rating: 0,
          requirements: 0,
        };

        if (
          typeof jobPosting.hourlyRateMin === 'number' &&
          typeof jobPosting.hourlyRateMax === 'number'
        ) {
          if (
            worker.hourlyRate >= jobPosting.hourlyRateMin &&
            worker.hourlyRate <= jobPosting.hourlyRateMax
          ) {
            scoreBreakdown.rate = 20;
          } else {
            const nearest =
              worker.hourlyRate < jobPosting.hourlyRateMin
                ? jobPosting.hourlyRateMin
                : jobPosting.hourlyRateMax;
            const distance = Math.abs(worker.hourlyRate - nearest);
            scoreBreakdown.rate = Math.max(
              0,
              20 - Math.floor(distance / 50000) * 5,
            );
          }
        } else {
          scoreBreakdown.rate = 10;
        }

        if (worker.verificationStatus === 'APPROVED') {
          scoreBreakdown.trust += 8;
        }
        if (worker.backgroundCheckStatus === 'APPROVED') {
          scoreBreakdown.trust += 8;
        }
        if (worker.drugScreenStatus === 'APPROVED') {
          scoreBreakdown.trust += 4;
        }

        if (worker.trainingPassed) {
          scoreBreakdown.training = 10;
        }

        scoreBreakdown.rating = Math.round(
          (Math.min(worker.rating, 5) / 5) * 15,
        );

        const normalizedRequirements = (
          jobPosting.requirements ?? ''
        ).toLowerCase();
        if (normalizedRequirements.includes('non-smok') && worker.nonSmoker) {
          scoreBreakdown.requirements += 5;
        }
        if (
          (normalizedRequirements.includes('drive') ||
            normalizedRequirements.includes('license') ||
            normalizedRequirements.includes('transport')) &&
          worker.hasReliableTransportation
        ) {
          scoreBreakdown.requirements += 5;
        }
        if (
          (normalizedRequirements.includes('cpr') ||
            normalizedRequirements.includes('first aid')) &&
          worker.certifications.some((item) => {
            const cert = item.toLowerCase();
            return cert.includes('cpr') || cert.includes('first aid');
          })
        ) {
          scoreBreakdown.requirements += 5;
        }

        const score = Object.values(scoreBreakdown).reduce(
          (sum, part) => sum + part,
          0,
        );

        return {
          workerId: worker.id,
          userId: worker.userId,
          name: worker.user.name,
          email: worker.user.email,
          phone: worker.user.phone,
          jobTypes: worker.jobTypes,
          rating: worker.rating,
          reviewCount: worker.reviewCount,
          hourlyRate: worker.hourlyRate,
          dailyRate: worker.dailyRate,
          nonSmoker: worker.nonSmoker,
          hasReliableTransportation: worker.hasReliableTransportation,
          trainingPassed: worker.trainingPassed,
          score,
          scoreBreakdown,
        };
      })
      .filter((item) => item.score >= minScore)
      .sort((a, b) => b.score - a.score || b.rating - a.rating)
      .slice(0, limit);

    return {
      jobPostingId,
      totalCandidates: recommendationItems.length,
      includeApplied,
      minScore,
      data: recommendationItems,
    };
  }
}
