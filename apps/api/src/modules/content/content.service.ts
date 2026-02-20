import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentValidator } from './validators/content-validator';
import { SchemaRegistry } from '../schema/schema-registry';
import { Prisma } from '@prisma/client';

interface FindAllOptions {
  page: number;
  perPage: number;
  status?: string;
  search?: string;
  sort: string;
  order: 'asc' | 'desc';
}

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validator: ContentValidator,
    private readonly schemaRegistry: SchemaRegistry
  ) {}

  async findAll(type: string, options: FindAllOptions) {
    this.ensureSchemaExists(type);

    const { page, perPage, status, search, sort, order } = options;
    const skip = (page - 1) * perPage;

    const where: Prisma.ContentWhereInput = { type };

    if (status) {
      where.status = status.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    }

    if (search) {
      where.data = {
        path: [],
        string_contains: search,
      };
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput = {};
    if (sort === 'createdAt' || sort === 'updatedAt') {
      orderBy[sort] = order;
    } else {
      orderBy.createdAt = order;
    }

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: perPage,
        orderBy,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.content.count({ where }),
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

  async findOne(type: string, id: string) {
    this.ensureSchemaExists(type);

    const content = await this.prisma.content.findFirst({
      where: { id, type },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!content) {
      throw new NotFoundException(`Content '${id}' not found`);
    }

    return { data: content };
  }

  async create(type: string, data: Record<string, unknown>, userId: string) {
    const schema = this.ensureSchemaExists(type);

    const errors = this.validator.validate(data, schema);
    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    const content = await this.prisma.content.create({
      data: {
        type,
        data: data as Prisma.InputJsonValue,
        createdBy: userId,
      },
    });

    return { data: content };
  }

  async update(type: string, id: string, data: Record<string, unknown>) {
    const schema = this.ensureSchemaExists(type);

    const existing = await this.prisma.content.findFirst({
      where: { id, type },
    });
    if (!existing) {
      throw new NotFoundException(`Content '${id}' not found`);
    }

    const errors = this.validator.validate(data, schema);
    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    const content = await this.prisma.content.update({
      where: { id },
      data: {
        data: data as Prisma.InputJsonValue,
        version: { increment: 1 },
      },
    });

    return { data: content };
  }

  async updateStatus(
    type: string,
    id: string,
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  ) {
    this.ensureSchemaExists(type);

    const existing = await this.prisma.content.findFirst({
      where: { id, type },
    });
    if (!existing) {
      throw new NotFoundException(`Content '${id}' not found`);
    }

    const content = await this.prisma.content.update({
      where: { id },
      data: { status },
    });

    return { data: content };
  }

  async remove(type: string, id: string) {
    this.ensureSchemaExists(type);

    const existing = await this.prisma.content.findFirst({
      where: { id, type },
    });
    if (!existing) {
      throw new NotFoundException(`Content '${id}' not found`);
    }

    await this.prisma.content.delete({ where: { id } });
    return { message: 'Content deleted successfully' };
  }

  private ensureSchemaExists(type: string) {
    const schema = this.schemaRegistry.getSchema(type);
    if (!schema) {
      throw new NotFoundException(`Content type '${type}' not found`);
    }
    return schema;
  }
}
