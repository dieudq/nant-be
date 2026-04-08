import { WorkersService } from './workers.service';
export declare class WorkersController {
    private workersService;
    constructor(workersService: WorkersService);
    findAll(): Promise<({
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
    findById(id: string): Promise<({
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
    create(data: any): Promise<{
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
    approve(id: string): Promise<{
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
    reject(id: string): Promise<{
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
