import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

// Interface for storing recent emails in memory (development only)
export interface DevEmail {
    to: string;
    subject: string;
    content: string;
    timestamp: Date;
}

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;
    // Store the last 50 emails sent in development mode
    private recentEmails: DevEmail[] = [];
    private readonly MAX_STORED_EMAILS = 50;

    constructor(private configService: ConfigService) {
        this.initTransporter();
    }

    /**
     * Store email for development purposes
     * This helps with testing by allowing retrieval of emails via dev tools
     */
    private storeEmailForDevelopment(to: string, subject: string, content: string): void {
        // Only store emails in development mode
        if (this.configService.get<string>('NODE_ENV') !== 'development') {
            return;
        }

        // Add the new email to the beginning of the array
        this.recentEmails.unshift({
            to,
            subject,
            content,
            timestamp: new Date()
        });

        // Limit the size of the array to avoid memory issues
        if (this.recentEmails.length > this.MAX_STORED_EMAILS) {
            this.recentEmails = this.recentEmails.slice(0, this.MAX_STORED_EMAILS);
        }
    }

    /**
     * Retrieve the latest email sent to a specific address (dev mode only)
     */
    getLatestEmailForAddress(email: string): DevEmail | null {
        if (this.configService.get<string>('NODE_ENV') !== 'development') {
            return null;
        }

        return this.recentEmails.find(mail => mail.to.toLowerCase() === email.toLowerCase()) || null;
    }

    /**
     * Get all recent emails (dev mode only)
     */
    getRecentEmails(): DevEmail[] | null {
        if (this.configService.get<string>('NODE_ENV') !== 'development') {
            return null;
        }

        return this.recentEmails;
    }

    private initTransporter() {
        const emailService = this.configService.get<string>('EMAIL_SERVICE');
        const emailHost = this.configService.get<string>('EMAIL_HOST');
        const emailPort = this.configService.get<number>('EMAIL_PORT');
        const emailUser = this.configService.get<string>('EMAIL_USER');
        const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
        const emailSecure = this.configService.get<boolean>('EMAIL_SECURE', false);

        try {
            this.transporter = nodemailer.createTransport({
                service: emailService === 'smtp' ? undefined : emailService,
                host: emailService === 'smtp' ? emailHost : undefined,
                port: emailService === 'smtp' ? emailPort : undefined,
                secure: emailSecure,
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                },
            });

            // Verify SMTP connection
            this.transporter.verify((error) => {
                if (error) {
                    this.logger.error('Email service not configured correctly', error);
                } else {
                    this.logger.log('Email service is configured and ready to send emails');
                }
            });

        } catch (error) {
            this.logger.error('Failed to initialize email transporter', error);
        }
    }

    /**
     * Send an email
     */
    async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
        try {
            const isDev = this.configService.get<string>('NODE_ENV') === 'development';

            if (isDev) {
                // In development, store the email for retrieval via dev tools
                this.storeEmailForDevelopment(to, subject, content);

                // Log the email
                this.logger.log(`📧 Email sent to: ${to}`);
                this.logger.log(`📧 Subject: ${subject}`);
                this.logger.log(`📧 Content: ${content}`);
                return true;
            }

            const from = this.configService.get<string>('EMAIL_FROM');

            const mailOptions = {
                from,
                to,
                subject,
                html: content,
            };

            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent to ${to}, messageId: ${result.messageId}`);

            return true;
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);

            // In development, still store the email to allow OTP retrieval
            const isDev = this.configService.get<string>('NODE_ENV') === 'development';
            if (isDev) {
                this.storeEmailForDevelopment(to, subject, content);
            }

            return false;
        }
    }

    /**
     * Send OTP verification email
     */
    async sendOtpEmail(to: string, otp: string, name: string): Promise<boolean> {
        const subject = 'EventHub - Verify Your Email';

        const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to EventHub, ${name}!</h2>
        <p>Thank you for registering. To verify your email address, please use the following verification code:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otp}</strong>
        </div>
        <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The EventHub Team</p>
      </div>
    `;

        return this.sendEmail(to, subject, content);
    }

    /**
     * Send password reset email with OTP code
     */
    async sendPasswordResetEmail(to: string, otp: string, name: string): Promise<boolean> {
        const subject = 'EventHub - Reset Your Password';

        const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. To complete the process, please use the following verification code:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otp}</strong>
        </div>
        <p>This code will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The EventHub Team</p>
      </div>
    `;

        return this.sendEmail(to, subject, content);
    }
}
