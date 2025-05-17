import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsBoolean, IsUUID, IsOptional, Min, IsNotEmpty, IsArray } from 'class-validator';

export class CreateEventDto {
    @ApiProperty({ description: 'Event title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Event description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Event date (YYYY-MM-DD)' })
    @IsDateString()
    date: Date;

    @ApiProperty({ description: 'Event time (HH:MM)' })
    @IsString()
    @IsNotEmpty()
    time: string;

    @ApiProperty({ description: 'Event location' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ description: 'Event price' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ description: 'Event image URL' })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ description: 'Event capacity (number of seats)' })
    @IsNumber()
    @Min(1)
    capacity: number;

    @ApiProperty({ description: 'Is this a featured event?' })
    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;

    @ApiProperty({ description: 'Category ID' })
    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({ description: 'Array of tag IDs', type: [String] })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    tagIds?: string[];
} 