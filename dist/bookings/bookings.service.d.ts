import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: any): Promise<({
        worker: {
            user: {
                email: string;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            bio: string | null;
            languages: string[];
            services: string[];
            hourlyRate: number;
            dailyRate: number;
            travelRate: number | null;
            rating: number;
            reviewCount: number;
            isApproved: boolean;
            availability: string[];
            certifications: string[];
        };
        family: {
            user: {
                email: string;
                name: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            numChildren: number | null;
            childrenAges: string | null;
            specialRequirements: string | null;
            preferences: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        familyId: number;
        workerId: number;
        date: Date;
        startTime: string;
        endTime: string;
        duration: number;
        service: string;
        rate: number;
        totalCost: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        notes: string | null;
    })[]>;
    findById(id: number): Promise<({
        worker: {
            user: {
                email: string;
                password: string;
                name: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            bio: string | null;
            languages: string[];
            services: string[];
            hourlyRate: number;
            dailyRate: number;
            travelRate: number | null;
            rating: number;
            reviewCount: number;
            isApproved: boolean;
            availability: string[];
            certifications: string[];
        };
        family: {
            user: {
                email: string;
                password: string;
                name: string;
                phone: string | null;
                role: import(".prisma/client").$Enums.Role;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            numChildren: number | null;
            childrenAges: string | null;
            specialRequirements: string | null;
            preferences: string | null;
        };
        payment: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: number;
            amount: number;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
        } | null;
        review: {
            id: number;
            createdAt: Date;
            rating: number;
            familyId: number;
            workerId: number;
            bookingId: number;
            comment: string | null;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        familyId: number;
        workerId: number;
        date: Date;
        startTime: string;
        endTime: string;
        duration: number;
        service: string;
        rate: number;
        totalCost: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        notes: string | null;
    }) | null>;
    create(data: any): Promise<{
        worker: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            bio: string | null;
            languages: string[];
            services: string[];
            hourlyRate: number;
            dailyRate: number;
            travelRate: number | null;
            rating: number;
            reviewCount: number;
            isApproved: boolean;
            availability: string[];
            certifications: string[];
        };
        family: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            numChildren: number | null;
            childrenAges: string | null;
            specialRequirements: string | null;
            preferences: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        familyId: number;
        workerId: number;
        date: Date;
        startTime: string;
        endTime: string;
        duration: number;
        service: string;
        rate: number;
        totalCost: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        notes: string | null;
    }>;
    updateStatus(id: number, status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'PENDING'): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        familyId: number;
        workerId: number;
        date: Date;
        startTime: string;
        endTime: string;
        duration: number;
        service: string;
        rate: number;
        totalCost: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        notes: string | null;
    }>;
    cancel(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        familyId: number;
        workerId: number;
        date: Date;
        startTime: string;
        endTime: string;
        duration: number;
        service: string;
        rate: number;
        totalCost: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        notes: string | null;
    }>;
}
