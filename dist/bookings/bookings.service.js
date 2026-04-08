"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filters) {
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
    async findById(id) {
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
            },
        });
    }
    async create(data) {
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
    async updateStatus(id, status) {
        return this.prisma.booking.update({
            where: { id },
            data: { status: status },
        });
    }
    async cancel(id) {
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map