import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SchemaModule } from './modules/schema/schema.module';
import { ContentModule } from './modules/content/content.module';
import { MediaModule } from './modules/media/media.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, SchemaModule, ContentModule, MediaModule, UsersModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
