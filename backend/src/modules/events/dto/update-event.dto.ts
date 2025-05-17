import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsBoolean, IsUUID, IsOptional, Min, IsNotEmpty, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {
    @ApiProperty({ description: 'Available seats (calculated from capacity - bookings)', required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    availableSeats?: number;
} 