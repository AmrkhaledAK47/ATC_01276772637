import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BookingStatus, UserRole } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
        return this.bookingsService.create(createBookingDto, req.user.id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'userId', required: false })
    @ApiQuery({ name: 'eventId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
    findAll(
        @Query('userId') userId?: string,
        @Query('eventId') eventId?: string,
        @Query('status') status?: BookingStatus,
        @Request() req?,
    ) {
        return this.bookingsService.findAll(
            {
                userId,
                eventId,
                status,
            },
            req.user,
        );
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getUserBookings(@Request() req) {
        return this.bookingsService.getUserBookings(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    findOne(@Param('id') id: string, @Request() req) {
        return this.bookingsService.findOne(id, req.user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    update(
        @Param('id') id: string,
        @Body() updateBookingDto: UpdateBookingDto,
        @Request() req
    ) {
        return this.bookingsService.update(id, updateBookingDto, req.user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.bookingsService.update(id, { status: BookingStatus.CANCELLED }, { role: UserRole.ADMIN });
    }
} 