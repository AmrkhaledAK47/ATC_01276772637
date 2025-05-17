import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SocialAuthDto {
    @ApiProperty({
        description: 'User email from the social provider',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'User display name',
        example: 'John Doe',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Name of the social provider',
        example: 'github',
        enum: ['github', 'google'],
    })
    @IsString()
    @IsNotEmpty()
    provider: string;

    @ApiProperty({
        description: 'Unique ID from the provider',
        example: '12345678',
    })
    @IsString()
    @IsNotEmpty()
    providerId: string;

    @ApiPropertyOptional({
        description: 'User avatar URL from the provider',
        example: 'https://avatars.githubusercontent.com/u/12345678',
    })
    @IsString()
    @IsUrl()
    @IsOptional()
    avatar?: string;
} 