import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async createUser(user: Prisma.UserCreateInput): Promise<{ success: boolean; user?: User; message?: string }> {
        try {
            const newUser = await this.prisma.user.create({
                data: user,
            });
            return { success: true, user: newUser, message: 'User created successfully' };
        } catch (error) {
            // console.error('[DEBUG] Error creating user:', error);
            if (error.code === 'P2002') {
                // Unique constraint failed
                return { success: false, message: 'User already exists' };
            }
            return { success: false, message: 'Error creating user' };
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            return null;
        }
    }



}
