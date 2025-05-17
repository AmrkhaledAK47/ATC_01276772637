import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'OTP code sent to user email',
        example: '123456'
    })
    otpCode: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({
        description: 'New password',
        example: 'NewSecurePassword123!'
    })
    newPassword: string;
}
