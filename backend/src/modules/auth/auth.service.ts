import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SocialAuthDto } from './dto/social-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '@/common/utils/email.service';
import { OtpService } from '@/common/utils/otp.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly otpService: OtpService,
    ) { }

    /**
     * Validate user credentials
     */
    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        // Remove password from returned user object
        const { password: _, ...result } = user;
        return result;
    }

    /**
     * Login user and generate access token
     */
    async login(user: any) {
        // Check if the user is verified (not required for social logins which are verified by the provider)
        if (!user.isVerified && !user.githubId && !user.googleId) {
            throw new UnauthorizedException('Please verify your email before logging in');
        }

        const payload = { email: user.email, sub: user.id };

        return {
            user,
            token: this.jwtService.sign(payload),
        };
    }

    /**
     * Register a new user
     */
    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);

        // Generate and send OTP
        const otp = this.otpService.generateOtp();
        await this.otpService.saveOtp(user.email, otp);
        await this.emailService.sendOtpEmail(user.email, otp, user.name);

        // Return user data without JWT since they're not verified yet
        return {
            user,
            message: 'Registration successful. Please check your email for verification code.',
        };
    }

    /**
     * Verify OTP after registration
     */
    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const { email, otpCode } = verifyOtpDto;

        const isValid = await this.otpService.verifyOtp(email, otpCode);

        if (!isValid) {
            throw new BadRequestException('Invalid or expired OTP code');
        }

        // Get the now-verified user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Remove password from user object
        const { password, ...userResult } = user;

        // Generate token since user is now verified
        const payload = { email: user.email, sub: user.id };

        return {
            user: userResult,
            token: this.jwtService.sign(payload),
            message: 'Email verification successful',
        };
    }

    /**
     * Resend OTP verification code
     */
    async resendOtp(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.isVerified) {
            throw new BadRequestException('User is already verified');
        }

        // Generate and send OTP
        const otp = this.otpService.generateOtp();
        await this.otpService.saveOtp(user.email, otp);
        await this.emailService.sendOtpEmail(user.email, otp, user.name);

        return {
            message: 'Verification code has been resent to your email',
        };
    }

    /**
     * Handle forgot password request
     */
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Generate and send OTP for password reset
        const otp = this.otpService.generateOtp();
        await this.otpService.saveOtp(user.email, otp, 'password_reset');

        // Send password reset email with OTP
        await this.emailService.sendPasswordResetEmail(user.email, otp, user.name);

        return {
            message: 'Password reset instructions have been sent to your email',
        };
    }

    /**
     * Reset password with OTP verification
     */
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, otpCode, newPassword } = resetPasswordDto;

        // Verify OTP specifically for password reset
        const isValid = await this.otpService.verifyOtp(email, otpCode, 'password_reset');

        if (!isValid) {
            throw new BadRequestException('Invalid or expired code');
        }

        // Get the user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return {
            message: 'Password has been reset successfully',
        };
    }

    /**
     * Validate or create a user from a social provider
     */
    async validateOrCreateSocialUser(socialAuthDto: SocialAuthDto) {
        // Try to find an existing user with the same email
        const existingUser = await this.prisma.user.findUnique({
            where: { email: socialAuthDto.email },
        });

        // If we find a user with the same email, update their social provider info
        if (existingUser) {
            const updatedUser = await this.prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    [socialAuthDto.provider + 'Id']: socialAuthDto.providerId,
                    isVerified: true, // Social logins are considered verified
                    // Update avatar if provided and user doesn't already have one
                    ...(socialAuthDto.avatar && !existingUser.avatar ? { avatar: socialAuthDto.avatar } : {}),
                },
            });

            // Remove password from returned user object
            const { password, ...result } = updatedUser;
            return result;
        }

        // Otherwise, create a new user
        // Generate a random secure password for the new account
        const randomPassword = Math.random().toString(36).slice(-10) +
            Math.random().toString(36).slice(-10).toUpperCase() +
            Math.random().toString(36).slice(2, 4) +
            '!';

        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Create user with social provider info
        const newUser = await this.prisma.user.create({
            data: {
                name: socialAuthDto.name,
                email: socialAuthDto.email,
                password: hashedPassword,
                isVerified: true, // Social logins are considered verified
                avatar: socialAuthDto.avatar, // Store the avatar URL
                [socialAuthDto.provider + 'Id']: socialAuthDto.providerId,
            },
        });

        // Remove password from returned user object
        const { password, ...result } = newUser;
        return result;
    }

    /**
     * Get OTP for development purposes only
     * @param email User's email
     */
    async getDevOtp(email: string): Promise<string | null> {
        // Try to get verification OTP
        const verificationOtp = await this.otpService.getLatestOtp(email, 'verification');
        if (verificationOtp) {
            return verificationOtp;
        }

        // Try to get password reset OTP
        const passwordResetOtp = await this.otpService.getLatestOtp(email, 'password_reset');
        if (passwordResetOtp) {
            return passwordResetOtp;
        }

        // If not found in OTP service, try to extract from latest email
        const latestEmail = this.emailService.getLatestEmailForAddress(email);
        if (latestEmail) {
            const match = latestEmail.content.match(/<strong>(\d{6})<\/strong>/);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }
}