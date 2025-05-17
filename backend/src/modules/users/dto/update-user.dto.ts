import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    @ApiPropertyOptional({
        description: 'User email',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        description: 'User name',
        example: 'John Doe',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'User password',
        example: 'Password123!',
    })
    @IsString()
    @IsOptional()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;

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
    })
    @IsOptional()
    role?: UserRole;
} 