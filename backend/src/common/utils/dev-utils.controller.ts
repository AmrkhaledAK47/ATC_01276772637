import { Controller, Get, Param, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';

@ApiTags('Development Utils')
@Controller('dev')
export class DevUtilsController {
    private readonly logger = new Logger(DevUtilsController.name);

    constructor(
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Get the latest OTP sent to an email address (DEV ONLY)
     */
    @Get('latest-otp/:email')
    @ApiOperation({ summary: '[DEV ONLY] Get latest OTP for a user' })
    @ApiResponse({ status: 200, description: 'OTP retrieved successfully', schema: { properties: { otp: { type: 'string', example: '123456' } } } })
    @ApiResponse({ status: 401, description: 'Endpoint only available in development mode' })
    async getLatestOtp(@Param('email') email: string) {
        // Only allow in development environment
        const nodeEnv = this.configService.get('NODE_ENV');
        if (nodeEnv !== 'development') {
            this.logger.warn(`Attempt to access dev endpoint in ${nodeEnv} environment`);
            throw new UnauthorizedException('This endpoint is only available in development mode');
        }

        this.logger.log(`Retrieving latest OTP for ${email}`);

        // Try first to get OTP directly from the OTP service for verification and password reset
        const verificationType = await this.otpService.getLatestOtp(email, 'verification');
        const passwordResetType = await this.otpService.getLatestOtp(email, 'password_reset');

        // Return the OTP that exists, preferring verification OTPs
        const otp = verificationType || passwordResetType;

        // If found, return it
        if (otp) {
            this.logger.debug(`Found OTP in OTP service: ${otp}`);
            return { otp };
        }

        // If not found, try to extract it from the email content
        const latestEmail = this.emailService.getLatestEmailForAddress(email);
        if (latestEmail) {
            this.logger.debug(`Found email to ${email}, timestamp: ${latestEmail.timestamp}`);

            // Extract OTP from email content using regex
            // The OTP should be in a <strong> tag in the email
            const match = latestEmail.content.match(/<strong>(\d{6})<\/strong>/);
            if (match && match[1]) {
                this.logger.debug(`Extracted OTP from email: ${match[1]}`);
                return { otp: match[1] };
            }
        }

        // If we can't find an OTP at all
        this.logger.debug(`No OTP found for ${email}`);
        return { otp: null };
    }

    /**
     * List all recent emails (DEV ONLY)
     */
    @Get('emails')
    @ApiOperation({ summary: '[DEV ONLY] List all recent emails sent' })
    async getEmails() {
        // Only allow in development environment
        const nodeEnv = this.configService.get('NODE_ENV');
        if (nodeEnv !== 'development') {
            this.logger.warn(`Attempt to access dev endpoint in ${nodeEnv} environment`);
            throw new UnauthorizedException('This endpoint is only available in development mode');
        }

        return this.emailService.getRecentEmails();
    }
}
