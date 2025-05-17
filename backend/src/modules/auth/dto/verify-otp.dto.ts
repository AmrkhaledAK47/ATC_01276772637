import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({
        description: 'User email for verification',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'OTP code received via email',
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    otpCode: string;
} 