import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    /**
     * Clean database during testing
     */
    async cleanDatabase() {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('This method is only available in test environment');
        }

        // Delete data in the correct order to avoid foreign key conflicts
        await this.$transaction([
            this.tagsOnEvents.deleteMany(),
            this.booking.deleteMany(),
            this.event.deleteMany(),
            this.tag.deleteMany(),
            this.category.deleteMany(),
            this.user.deleteMany(),
        ]);
    }
} 