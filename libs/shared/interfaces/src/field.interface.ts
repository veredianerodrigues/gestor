export type FieldType =
  | 'string'
  | 'text'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'image'
  | 'file'
  | 'slug'
  | 'reference'
  | 'array'
  | 'object'
  | 'select'
  | 'color'
  | 'url'
  | 'email';

export interface FieldDefinition {
  name: string;
  title: string;
  type: FieldType;
  required?: boolean;
  description?: string;
  options?: FieldOptions;
  validation?: FieldValidation;
  of?: FieldDefinition[];
  fields?: FieldDefinition[];
  to?: string;
  source?: string;
}

export interface FieldOptions {
  list?: { title: string; value: string }[];
  layout?: 'dropdown' | 'radio' | 'tags';
  hotspot?: boolean;
  maxLength?: number;
  rows?: number;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  regex?: string;
  unique?: boolean;
  custom?: string;
}
