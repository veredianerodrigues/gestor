import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  constructor(private readonly prisma: PrismaService) {
    this.uploadDir = process.env['UPLOAD_DIR'] || './uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uniqueName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    fs.writeFileSync(filePath, file.buffer);

    let width: number | null = null;
    let height: number | null = null;

    if (file.mimetype.startsWith('image/')) {
      try {
        const sharp = await import('sharp');
        const metadata = await sharp.default(file.buffer).metadata();
        width = metadata.width || null;
        height = metadata.height || null;
      } catch {
        // Image processing not available, skip dimensions
      }
    }

    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${uniqueName}`,
        width,
        height,
        uploadedBy: userId,
      },
    });

    return { data: media };
  }

  async findAll(page: number, perPage: number) {
    const skip = (page - 1) * perPage;

    const [items, total] = await Promise.all([
      this.prisma.media.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count(),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media '${id}' not found`);
    }

    const filePath = path.join(this.uploadDir, path.basename(media.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.prisma.media.delete({ where: { id } });
    return { message: 'Media deleted successfully' };
  }
}
