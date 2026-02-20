import { FieldType } from '@cms/shared/interfaces';

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'text', label: 'Text' },
  { value: 'richtext', label: 'Rich Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'datetime', label: 'Date & Time' },
  { value: 'image', label: 'Image' },
  { value: 'file', label: 'File' },
  { value: 'slug', label: 'Slug' },
  { value: 'reference', label: 'Reference' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
  { value: 'select', label: 'Select' },
  { value: 'color', label: 'Color' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'video', label: 'Video' },
  { value: 'gallery', label: 'Gallery' },
];
