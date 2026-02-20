import { Module } from '@nestjs/common';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';
import { SchemaRegistry } from './schema-registry';

@Module({
  controllers: [SchemaController],
  providers: [SchemaService, SchemaRegistry],
  exports: [SchemaRegistry],
})
export class SchemaModule {}
