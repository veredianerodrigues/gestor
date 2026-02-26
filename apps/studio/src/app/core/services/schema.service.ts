import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { ContentTypeDefinition } from '@cms/shared/interfaces';

@Injectable({ providedIn: 'root' })
export class SchemaService {
  schemas = signal<ContentTypeDefinition[]>([]);

  constructor(private api: ApiService) {}

  loadSchemas() {
    return this.api.get<ContentTypeDefinition[]>('/schemas').pipe();
  }

  refreshSchemas() {
    this.loadSchemas().subscribe((schemas) => {
      this.schemas.set(schemas);
    });
  }

  getSchema(name: string) {
    return this.api.get<ContentTypeDefinition>(`/schemas/${name}`);
  }
}
