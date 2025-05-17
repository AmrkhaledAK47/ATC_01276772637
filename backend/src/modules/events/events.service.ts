import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new event
     */
    async create(createEventDto: CreateEventDto, organizerId: string) {
        const { tagIds, ...eventData } = createEventDto;

        // Check if category exists
        const categoryExists = await this.prisma.category.findUnique({
            where: { id: eventData.categoryId },
        });

        if (!categoryExists) {
            throw new NotFoundException(`Category with ID ${eventData.categoryId} not found`);
        }

        try {
            // Create event with tags if provided
            return await this.prisma.$transaction(async (prisma) => {
                // Create the event
                const event = await prisma.event.create({
                    data: {
                        ...eventData,
                        availableSeats: eventData.capacity,
                        organizerId,
                    },
                });

                // Add tags if provided
                if (tagIds && tagIds.length > 0) {
                    await Promise.all(
                        tagIds.map((tagId) =>
                            prisma.tagsOnEvents.create({
                                data: {
                                    eventId: event.id,
                                    tagId,
                                },
                            })
                        )
                    );
                }

                return this.findOne(event.id);
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('One or more tags were not found');
                }
            }
            throw error;
        }
    }

    /**
     * Find all events with optional filtering
     */
    async findAll(params?: {
        categoryId?: string;
        tagIds?: string[];
        search?: string;
        isFeatured?: boolean;
        skip?: number;
        take?: number;
    }) {
        const { categoryId, tagIds, search, isFeatured, skip, take } = params || {};

        // Build where conditions
        const where: Prisma.EventWhereInput = {};

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (tagIds && tagIds.length > 0) {
            where.tags = {
                some: {
                    tagId: {
                        in: tagIds,
                    },
                },
            };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }

        return this.prisma.event.findMany({
            where,
            include: {
                category: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            skip,
            take,
            orderBy: {
                date: 'asc',
            },
        });
    }

    /**
     * Find event by ID
     */
    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                category: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        return event;
    }

    /**
     * Update an event
     */
    async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
        // First check if event exists and belongs to the user or user is admin
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                tags: true,
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        // Extract tag IDs from DTO if present
        const { tagIds, ...eventData } = updateEventDto;

        try {
            return await this.prisma.$transaction(async (prisma) => {
                // Update event data
                const updatedEvent = await prisma.event.update({
                    where: { id },
                    data: eventData,
                });

                // Update tags if provided
                if (tagIds) {
                    // Delete existing tag associations
                    await prisma.tagsOnEvents.deleteMany({
                        where: { eventId: id },
                    });

                    // Create new tag associations
                    if (tagIds.length > 0) {
                        await Promise.all(
                            tagIds.map((tagId) =>
                                prisma.tagsOnEvents.create({
                                    data: {
                                        eventId: id,
                                        tagId,
                                    },
                                })
                            )
                        );
                    }
                }

                return this.findOne(id);
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('One or more tags were not found');
                }
            }
            throw error;
        }
    }

    /**
     * Delete an event
     */
    async remove(id: string) {
        // Check if event exists
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        // Check if event has any bookings
        const bookings = await this.prisma.booking.count({
            where: { eventId: id },
        });

        if (bookings > 0) {
            throw new BadRequestException('Cannot delete an event with existing bookings');
        }

        // Delete the event
        return this.prisma.event.delete({
            where: { id },
        });
    }

    /**
     * Get featured events
     */
    async getFeaturedEvents() {
        return this.findAll({ isFeatured: true, take: 6 });
    }

    /**
     * Check if a user has booked an event
     */
    async isEventBookedByUser(eventId: string, userId: string): Promise<boolean> {
        const booking = await this.prisma.booking.findFirst({
            where: {
                eventId,
                userId,
            },
        });

        return !!booking;
    }
} 