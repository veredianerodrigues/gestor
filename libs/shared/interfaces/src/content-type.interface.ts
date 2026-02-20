import { FieldDefinition } from './field.interface';

export interface ContentTypeDefinition {
  name: string;
  title: string;
  icon?: string;
  description?: string;
  fields: FieldDefinition[];
  preview?: {
    title: string;
    subtitle?: string;
    media?: string;
  };
  defaultVisibility?: 'PUBLIC' | 'RESTRICTED';
}
