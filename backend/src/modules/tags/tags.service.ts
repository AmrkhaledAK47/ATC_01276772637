import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new tag
     */
    async create(createTagDto: CreateTagDto) {
        try {
            return await this.prisma.tag.create({
                data: createTagDto,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException(`Tag with name '${createTagDto.name}' already exists`);
            }
            throw error;
        }
    }

    /**
     * Find all tags
     */
    async findAll() {
        return this.prisma.tag.findMany({
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
     * Find tag by ID
     */
    async findOne(id: string) {
        const tag = await this.prisma.tag.findUnique({
            where: { id },
            include: {
                events: {
                    include: {
                        event: true,
                    },
                },
                _count: {
                    select: { events: true },
                },
            },
        });

        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        return tag;
    }

    /**
     * Update a tag
     */
    async update(id: string, updateTagDto: UpdateTagDto) {
        try {
            // Check if tag exists
            const tag = await this.prisma.tag.findUnique({
                where: { id },
            });

            if (!tag) {
                throw new NotFoundException(`Tag with ID ${id} not found`);
            }

            return await this.prisma.tag.update({
                where: { id },
                data: updateTagDto,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new BadRequestException(`Tag with name '${updateTagDto.name}' already exists`);
            }
            throw error;
        }
    }

    /**
     * Delete a tag
     */
    async remove(id: string) {
        // Check if tag exists
        const tag = await this.prisma.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { events: true },
                },
            },
        });

        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        return this.prisma.tag.delete({
            where: { id },
        });
    }
} 