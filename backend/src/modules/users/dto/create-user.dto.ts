import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({
        description: 'User email',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'Password123!',
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiPropertyOptional({
        description: 'User avatar URL',
        example: 'https://example.com/avatar.jpg',
    })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiPropertyOptional({
        description: 'User role',
        enum: UserRole,
        default: UserRole.USER,
    })
    @IsOptional()
    role?: UserRole;
} 