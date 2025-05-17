import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export type OtpType = 'verification' | 'password_reset';

@Injectable()
export class OtpService {
    private readonly logger = new Logger(OtpService.name);
    // In-memory OTP storage for production should use Redis
    private otpStorage = new Map<string, {
        otp: string,
        expires: Date,
        attempts: number,
        lastAttempt: Date | null,
        type: OtpType
    }>();

    // Security settings
    private readonly MAX_ATTEMPTS = 5; // Maximum verification attempts
    private readonly LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) { }

    /**
     * Generate a 6-digit OTP code using a cryptographically secure method
     */
    generateOtp(): string {
        // Use crypto.randomBytes for more secure random number generation
        const buffer = crypto.randomBytes(3); // 3 bytes = 24 bits
        const number = buffer.readUIntBE(0, 3) % 900000 + 100000; // Ensure it's 6 digits
        return number.toString();
    }

    /**
     * Save OTP for a user with security features
     * @param email User's email
     * @param otp OTP code
     * @param type OTP type (verification or password_reset)
     */
    async saveOtp(email: string, otp: string, type: OtpType = 'verification'): Promise<void> {
        const lowerEmail = email.toLowerCase();

        // Set expiry to 10 minutes from now
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 10);

        // Store the OTP with reset attempts counter and type
        this.otpStorage.set(lowerEmail + ':' + type, {
            otp,
            expires,
            attempts: 0,
            lastAttempt: null,
            type
        });

        // Log OTP generation in production for audit purposes
        const environment = this.configService.get<string>('NODE_ENV');
        if (environment === 'production') {
            this.logger.log(`OTP generated for ${lowerEmail} (type: ${type}, expires: ${expires.toISOString()})`);
        }
    }

    /**
     * Get latest OTP for a user (development only)
     * @param email User's email
     * @param type OTP type (verification or password_reset)
     */
    async getLatestOtp(email: string, type: OtpType = 'verification'): Promise<string | null> {
        if (this.configService.get<string>('NODE_ENV') === 'production') {
            this.logger.warn('getLatestOtp was called in production environment');
            return null;
        }

        const lowerEmail = email.toLowerCase();
        const stored = this.otpStorage.get(lowerEmail + ':' + type);

        if (!stored || stored.expires < new Date()) {
            return null;
        }

        return stored.otp;
    }

    /**
     * Verify OTP for a user with enhanced security
     * @param email User's email
     * @param otpCode OTP code entered by the user
     * @param type OTP type (verification or password_reset)
     */
    async verifyOtp(email: string, otpCode: string, type: OtpType = 'verification'): Promise<boolean> {
        const lowerEmail = email.toLowerCase();
        const key = lowerEmail + ':' + type;
        const stored = this.otpStorage.get(key);

        if (!stored) {
            return false;
        }

        // Check if OTP is expired
        if (stored.expires < new Date()) {
            this.otpStorage.delete(key);
            return false;
        }

        // Check if account is temporarily locked due to too many attempts
        if (stored.attempts >= this.MAX_ATTEMPTS && stored.lastAttempt) {
            const lockoutEnds = new Date(stored.lastAttempt.getTime() + this.LOCKOUT_TIME);
            if (new Date() < lockoutEnds) {
                this.logger.warn(`Account ${lowerEmail} locked due to too many failed attempts for ${type}`);
                return false;
            }
            // If lockout period has passed, reset attempts
            stored.attempts = 0;
        }

        // Record this attempt
        stored.lastAttempt = new Date();
        stored.attempts++;

        if (stored.attempts < this.MAX_ATTEMPTS) {
            // Update the stored record if not at max attempts yet
            this.otpStorage.set(key, stored);
        }

        // Check if OTP matches
        const isValid = stored.otp === otpCode;

        // If valid, delete the OTP to prevent reuse
        if (isValid) {
            this.otpStorage.delete(key);

            // For email verification type, mark user as verified in the database
            if (type === 'verification') {
                await this.prisma.user.update({
                    where: { email: lowerEmail },
                    data: { isVerified: true }
                });

                this.logger.log(`User ${lowerEmail} successfully verified their email`);
            } else {
                this.logger.log(`User ${lowerEmail} successfully completed ${type} flow`);
            }
        } else {
            // Log failed attempt in production
            if (this.configService.get<string>('NODE_ENV') === 'production') {
                this.logger.warn(`Failed ${type} OTP verification attempt for ${lowerEmail} (Attempt ${stored.attempts}/${this.MAX_ATTEMPTS})`);
            }
        }

        return isValid;
    }
} 