import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateBookingDto {
    @ApiProperty({ description: 'Event ID' })
    @IsUUID()
    @IsNotEmpty()
    eventId: string;

    @ApiProperty({ description: 'Number of tickets to book', default: 1 })
    @IsInt()
    @Min(1)
    tickets: number = 1;

    @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    paymentMethod: PaymentMethod;
} 