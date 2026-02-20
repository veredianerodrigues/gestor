import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SchemaService } from './schema.service';

@Controller('schemas')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  getAll() {
    return this.schemaService.getAll();
  }

  @Get(':name')
  getByName(@Param('name') name: string) {
    const schema = this.schemaService.getByName(name);
    if (!schema) {
      throw new NotFoundException(`Schema '${name}' not found`);
    }
    return schema;
  }
}
