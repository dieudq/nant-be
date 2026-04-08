import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        email: string;
        name: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        id: number;
        createdAt: Date;
    } | null>;
}
