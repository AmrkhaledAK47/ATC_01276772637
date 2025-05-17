import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
    controllers: [TagsController],
    providers: [TagsService, PrismaService],
    exports: [TagsService],
})
export class TagsModule { } 