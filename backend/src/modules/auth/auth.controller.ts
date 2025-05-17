import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    HttpCode,
    HttpStatus,
    Redirect,
    Res,
    Param,
    UnauthorizedException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    // Development only route for getting OTPs
    @Get('dev/latest-otp/:email')
    @ApiOperation({ summary: '[DEV ONLY] Get latest OTP for a user' })
    async getLatestOtp(@Param('email') email: string) {
        // Only allow in development environment
        if (this.configService.get('NODE_ENV') !== 'development') {
            throw new UnauthorizedException('This endpoint is only available in development mode');
        }

        // Try to get OTP from the OTP service
        try {
            const otp = await this.authService.getDevOtp(email);
            return { otp };
        } catch (error) {
            throw new UnauthorizedException('Could not get OTP for the specified email');
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('local'))
    @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 attempts per minute
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 3, ttl: 60000 } })  // 3 registrations per minute
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 OTP verification attempts per minute
    @ApiOperation({ summary: 'Verify OTP code' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid OTP' })
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @Get('resend-otp/:email')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })  // 3 resend requests per minute
    @ApiOperation({ summary: 'Resend OTP code' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async resendOtp(@Param('email') email: string) {
        return this.authService.resendOtp(email);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })  // 3 requests per minute
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset instructions sent' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })  // 3 requests per minute
    @ApiOperation({ summary: 'Reset password with OTP verification' })
    @ApiResponse({ status: 200, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Bad request or invalid OTP' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getProfile(@Request() req) {
        return req.user;
    }

    // GitHub OAuth
    @Get('github')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'Authenticate with GitHub' })
    @ApiResponse({ status: 302, description: 'Redirects to GitHub authorization page' })
    async githubAuth(@Request() req) {
        // Store remember preference in session for use in callback
        if (req.query && req.query.remember) {
            if (!req.session) req.session = {};
            req.session.rememberMe = req.query.remember === 'true';
        }
        // Main method is handled by Passport
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'GitHub OAuth callback' })
    @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
    async githubAuthCallback(@Request() req, @Res() res) {
        try {
            if (!req.user) {
                const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:8080');
                console.error('GitHub callback error: No user data received');
                return res.redirect(`${frontendUrl}/auth/callback?error=auth_failed&error_description=User%20data%20missing&provider=github`);
            }

            const { user, token } = await this.authService.login(req.user);
            const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:8080');

            // Get remember preference from session if available
            const rememberMe = req.session?.rememberMe === true;

            // Redirect to frontend with token and remember preference
            return res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=github&remember=${rememberMe}`);
        } catch (error) {
            console.error('GitHub callback error:', error);
            const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:8080');
            const errorMessage = encodeURIComponent(error.message || 'Authentication failed');

            // Redirect to frontend with error
            return res.redirect(`${frontendUrl}/auth/callback?error=auth_failed&error_description=${errorMessage}&provider=github`);
        }
    }

    // Google OAuth
    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Authenticate with Google' })
    @ApiResponse({ status: 302, description: 'Redirects to Google authorization page' })
    async googleAuth(@Request() req) {
        // Store remember preference in session for use in callback
        if (req.query && req.query.remember) {
            if (!req.session) req.session = {};
            req.session.rememberMe = req.query.remember === 'true';
        }
        // Main method is handled by Passport
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
    async googleAuthCallback(@Request() req, @Res() res) {
        try {
            if (!req.user) {
                const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:8080');
                console.error('Google callback error: No user data received');
                return res.redirect(`${frontendUrl}/auth/callback?error=auth_failed&error_description=User%20data%20missing&provider=google`);
            }

            const { user, token } = await this.authService.login(req.user);
            const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:8080');

            // Get remember preference from session if available
            const rememberMe = req.session?.rememberMe === true;

            // Redirect to frontend with token and remember preference
            return res.redirect(`${frontendUrl}/auth/callback?token=${token}&provider=google&remember=${rememberMe}`);
        } catch (error) {
            console.error('Google callback error:', error);
            const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:8080');
            const errorMessage = encodeURIComponent(error.message || 'Authentication failed');

            // Redirect to frontend with error
            return res.redirect(`${frontendUrl}/auth/callback?error=auth_failed&error_description=${errorMessage}&provider=google`);
        }
    }
} 