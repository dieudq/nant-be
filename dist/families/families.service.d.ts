import { PrismaService } from '../prisma/prisma.service';
export declare class FamiliesService {
    private prisma;
    constructor(prisma: PrismaService);
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
        numChildren: number | null;
        childrenAges: string | null;
        specialRequirements: string | null;
        preferences: string | null;
    })[]>;
    findById(id: number): Promise<({
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
        numChildren: number | null;
        childrenAges: string | null;
        specialRequirements: string | null;
        preferences: string | null;
    }>;
    update(id: number, data: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        numChildren: number | null;
        childrenAges: string | null;
        specialRequirements: string | null;
        preferences: string | null;
    }>;
}
