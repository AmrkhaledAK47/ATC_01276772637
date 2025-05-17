import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export class UpdateBookingDto {
    @ApiProperty({ description: 'Booking status', enum: BookingStatus, required: false })
    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;

    @ApiProperty({ description: 'Payment status', enum: PaymentStatus, required: false })
    @IsEnum(PaymentStatus)
    @IsOptional()
    paymentStatus?: PaymentStatus;
} 