import { Injectable } from '@nestjs/common';
import { SchemaRegistry } from './schema-registry';
import { ContentTypeDefinition } from '@cms/shared/interfaces';

@Injectable()
export class SchemaService {
  constructor(private readonly registry: SchemaRegistry) {}

  getAll(): ContentTypeDefinition[] {
    return this.registry.getAllSchemas();
  }

  getByName(name: string): ContentTypeDefinition | undefined {
    return this.registry.getSchema(name);
  }
}
