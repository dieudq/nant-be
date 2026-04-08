import { FamiliesService } from './families.service';
export declare class FamiliesController {
    private familiesService;
    constructor(familiesService: FamiliesService);
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
    findById(id: string): Promise<({
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
        numChildren: number | null;
        childrenAges: string | null;
        specialRequirements: string | null;
        preferences: string | null;
    }>;
}
