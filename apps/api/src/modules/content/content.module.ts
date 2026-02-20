import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentValidator } from './validators/content-validator';
import { SchemaModule } from '../schema/schema.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [SchemaModule],
  controllers: [ContentController],
  providers: [ContentService, ContentValidator, PrismaService],
})
export class ContentModule {}
