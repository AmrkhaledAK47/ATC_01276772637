import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
    @ApiBearerAuth()
    create(@Body() createEventDto: CreateEventDto, @Request() req) {
        return this.eventsService.create(createEventDto, req.user.id);
    }

    @Get()
    @ApiQuery({ name: 'categoryId', required: false })
    @ApiQuery({ name: 'tagIds', required: false, isArray: true })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('tagIds') tagIds?: string[],
        @Query('search') search?: string,
        @Query('isFeatured') isFeatured?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Request() req?,
    ) {
        const skip = page > 0 ? (page - 1) * (limit || 10) : 0;
        const take = limit > 0 ? limit : 10;

        return this.eventsService.findAll({
            categoryId,
            tagIds: Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : undefined,
            search,
            isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
            skip,
            take,
        });
    }

    @Get('featured')
    getFeaturedEvents() {
        return this.eventsService.getFeaturedEvents();
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.eventsService.findOne(id);
    }

    @Get(':id/is-booked')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    isEventBooked(@Param('id') id: string, @Request() req) {
        return this.eventsService.isEventBookedByUser(id, req.user.id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
    @ApiBearerAuth()
    update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
        @Request() req
    ) {
        return this.eventsService.update(id, updateEventDto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
} 