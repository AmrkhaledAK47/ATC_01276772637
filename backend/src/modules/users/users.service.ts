import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new user
     */
    async create(createUserDto: CreateUserDto) {
        // Check if user with email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });

        // Remove password from returned user object
        const { password, ...result } = user;
        return result;
    }

    /**
     * Find all users
     */
    async findAll() {
        const users = await this.prisma.user.findMany();

        // Remove password from each user
        return users.map(user => {
            const { password, ...result } = user;
            return result;
        });
    }

    /**
     * Find a user by ID
     */
    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Remove password from returned user object
        const { password, ...result } = user;
        return result;
    }

    /**
     * Find a user by email
     */
    async findByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        return user;
    }

    /**
     * Update a user
     */
    async update(id: string, updateUserDto: UpdateUserDto) {
        // Check if user exists
        await this.findOne(id);

        // Hash password if provided
        let data = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const user = await this.prisma.user.update({
            where: { id },
            data,
        });

        // Remove password from returned user object
        const { password, ...result } = user;
        return result;
    }

    /**
     * Delete a user
     */
    async remove(id: string) {
        // Check if user exists
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { id };
    }
} 