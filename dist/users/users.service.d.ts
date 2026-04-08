import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
        createdAt: Date;
    }[]>;
    findById(id: number): Promise<{
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
        createdAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    update(id: number, data: any): Promise<{
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
    }>;
    delete(id: number): Promise<{
        email: string;
        password: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
