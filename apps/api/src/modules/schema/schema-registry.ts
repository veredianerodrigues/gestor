import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ContentTypeDefinition } from '@cms/shared/interfaces';
import { postSchema } from '../../config/schemas/post.schema';
import { authorSchema } from '../../config/schemas/author.schema';
import { pageSchema } from '../../config/schemas/page.schema';
import { portfolioSchema } from '../../config/schemas/portfolio.schema';

@Injectable()
export class SchemaRegistry implements OnModuleInit {
  private readonly logger = new Logger(SchemaRegistry.name);
  private schemas: Map<string, ContentTypeDefinition> = new Map();

  onModuleInit() {
    this.registerSchema(postSchema);
    this.registerSchema(authorSchema);
    this.registerSchema(pageSchema);
    this.registerSchema(portfolioSchema);
    this.logger.log(
      `Registered ${this.schemas.size} schemas: ${[...this.schemas.keys()].join(', ')}`
    );
  }

  registerSchema(schema: ContentTypeDefinition) {
    this.validateSchema(schema);
    this.schemas.set(schema.name, schema);
  }

  getSchema(name: string): ContentTypeDefinition | undefined {
    return this.schemas.get(name);
  }

  getAllSchemas(): ContentTypeDefinition[] {
    return Array.from(this.schemas.values());
  }

  hasSchema(name: string): boolean {
    return this.schemas.has(name);
  }

  private validateSchema(schema: ContentTypeDefinition) {
    if (!schema.name) {
      throw new Error('Schema must have a name');
    }
    if (!schema.title) {
      throw new Error(`Schema '${schema.name}' must have a title`);
    }
    if (!schema.fields || schema.fields.length === 0) {
      throw new Error(`Schema '${schema.name}' must have at least one field`);
    }

    const fieldNames = new Set<string>();
    for (const field of schema.fields) {
      if (!field.name) {
        throw new Error(
          `All fields in schema '${schema.name}' must have a name`
        );
      }
      if (fieldNames.has(field.name)) {
        throw new Error(
          `Duplicate field name '${field.name}' in schema '${schema.name}'`
        );
      }
      fieldNames.add(field.name);
    }
  }
}
