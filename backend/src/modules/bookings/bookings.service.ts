import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookingStatus, PaymentStatus, UserRole } from '@prisma/client';
import { CreateBookingDto, UpdateBookingDto } from './dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new booking
     */
    async create(createBookingDto: CreateBookingDto, userId: string) {
        const { eventId, tickets, paymentMethod } = createBookingDto;

        // Check if the event exists and has enough available seats
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        if (event.availableSeats < tickets) {
            throw new BadRequestException(`Not enough available seats. Only ${event.availableSeats} seats left.`);
        }

        // Check if user already has a booking for this event
        const existingBooking = await this.prisma.booking.findFirst({
            where: {
                userId,
                eventId,
            },
        });

        if (existingBooking) {
            throw new BadRequestException('You have already booked this event');
        }

        try {
            // Create booking and update available seats in a transaction
            return await this.prisma.$transaction(async (prisma) => {
                // Calculate total price
                const totalPrice = event.price * tickets;

                // Create the booking
                const booking = await prisma.booking.create({
                    data: {
                        userId,
                        eventId,
                        tickets,
                        totalPrice,
                        status: BookingStatus.CONFIRMED, // Auto-confirm for now
                        paymentStatus: PaymentStatus.COMPLETED, // Auto-complete payment for now
                        paymentMethod,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        event: true,
                    },
                });

                // Update available seats for the event
                await prisma.event.update({
                    where: { id: eventId },
                    data: {
                        availableSeats: {
                            decrement: tickets,
                        },
                    },
                });

                return booking;
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Find all bookings with optional filtering
     */
    async findAll(params?: {
        userId?: string;
        eventId?: string;
        status?: BookingStatus;
    }, currentUser?: any) {
        const { userId, eventId, status } = params || {};

        // Build where conditions
        const where: any = {};

        // If user is not admin, they can only see their own bookings
        if (currentUser && currentUser.role !== UserRole.ADMIN) {
            where.userId = currentUser.id;
        } else if (userId) {
            where.userId = userId;
        }

        if (eventId) {
            where.eventId = eventId;
        }

        if (status) {
            where.status = status;
        }

        return this.prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                event: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Find booking by ID
     */
    async findOne(id: string, currentUser?: any) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                event: true,
            },
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        // If user is not admin and not the booking owner, deny access
        if (currentUser && currentUser.role !== UserRole.ADMIN && currentUser.id !== booking.userId) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return booking;
    }

    /**
     * Update a booking
     */
    async update(id: string, updateBookingDto: UpdateBookingDto, currentUser: any) {
        // First check if booking exists
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                event: true,
            },
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        // Only admins can update any booking, users can only update their own
        if (currentUser.role !== UserRole.ADMIN && currentUser.id !== booking.userId) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        // Handle cancellation
        if (updateBookingDto.status === BookingStatus.CANCELLED && booking.status !== BookingStatus.CANCELLED) {
            return this.cancelBooking(id, booking);
        }

        // Regular update
        return this.prisma.booking.update({
            where: { id },
            data: updateBookingDto,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                event: true,
            },
        });
    }

    /**
     * Cancel a booking
     */
    private async cancelBooking(id: string, booking: any) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                // Update booking status
                const updatedBooking = await prisma.booking.update({
                    where: { id },
                    data: {
                        status: BookingStatus.CANCELLED,
                        paymentStatus: PaymentStatus.REFUNDED,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        event: true,
                    },
                });

                // Return tickets to available seats
                await prisma.event.update({
                    where: { id: booking.eventId },
                    data: {
                        availableSeats: {
                            increment: booking.tickets,
                        },
                    },
                });

                return updatedBooking;
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get user's bookings
     */
    async getUserBookings(userId: string) {
        return this.findAll({ userId });
    }

    /**
     * Get event bookings
     */
    async getEventBookings(eventId: string) {
        return this.findAll({ eventId });
    }
} 