import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { OtpService } from './otp.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { DevUtilsController } from './dev-utils.controller';

@Module({
    imports: [ConfigModule],
    controllers: [DevUtilsController],
    providers: [EmailService, OtpService, PrismaService],
    exports: [EmailService, OtpService],
})
export class UtilsModule { } 