import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new category
     */
    async create(createCategoryDto: CreateCategoryDto) {
        try {
            return await this.prisma.category.create({
                data: createCategoryDto,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException(`Category with name '${createCategoryDto.name}' already exists`);
            }
            throw error;
        }
    }

    /**
     * Find all categories
     */
    async findAll() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: { events: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    /**
     * Find category by ID
     */
    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                events: true,
                _count: {
                    select: { events: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    /**
     * Update a category
     */
    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        try {
            // Check if category exists
            const category = await this.prisma.category.findUnique({
                where: { id },
            });

            if (!category) {
                throw new NotFoundException(`Category with ID ${id} not found`);
            }

            return await this.prisma.category.update({
                where: { id },
                data: updateCategoryDto,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException(`Category with name '${updateCategoryDto.name}' already exists`);
            }
            throw error;
        }
    }

    /**
     * Delete a category
     */
    async remove(id: string) {
        // Check if category exists
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { events: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Check if category has events
        if (category._count.events > 0) {
            throw new BadRequestException('Cannot delete a category with associated events');
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
} 