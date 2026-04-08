import { PrismaService } from '../prisma/prisma.service';
export declare class WorkersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: any): Promise<({
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: number;
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
    })[]>;
    findById(id: number): Promise<({
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: number;
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
    }) | null>;
    create(userId: number, data: any): Promise<{
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
    }>;
    update(id: number, data: any): Promise<{
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
    }>;
    getPending(): Promise<({
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
    })[]>;
    approve(id: number): Promise<{
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
    }>;
    reject(id: number): Promise<{
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
    }>;
}
