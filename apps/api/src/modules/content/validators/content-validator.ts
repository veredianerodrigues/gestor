import { Injectable } from '@nestjs/common';
import {
  ContentTypeDefinition,
  FieldDefinition,
} from '@cms/shared/interfaces';

export interface ValidationError {
  field: string;
  message: string;
}

@Injectable()
export class ContentValidator {
  validate(
    data: Record<string, unknown>,
    schema: ContentTypeDefinition
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const field of schema.fields) {
      const value = data[field.name];
      this.validateField(field, value, field.name, errors);
    }

    return errors;
  }

  private validateField(
    field: FieldDefinition,
    value: unknown,
    path: string,
    errors: ValidationError[]
  ) {
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({ field: path, message: `${field.title} is required` });
      return;
    }

    if (value === undefined || value === null) {
      return;
    }

    switch (field.type) {
      case 'string':
      case 'text':
      case 'richtext':
      case 'slug':
      case 'url':
      case 'email':
      case 'color':
        if (typeof value !== 'string') {
          errors.push({
            field: path,
            message: `${field.title} must be a string`,
          });
        } else {
          this.validateStringOptions(field, value, path, errors);
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          errors.push({
            field: path,
            message: `${field.title} must be a number`,
          });
        } else {
          this.validateNumberOptions(field, value, path, errors);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            field: path,
            message: `${field.title} must be a boolean`,
          });
        }
        break;

      case 'date':
      case 'datetime':
        if (typeof value !== 'string' || isNaN(Date.parse(value))) {
          errors.push({
            field: path,
            message: `${field.title} must be a valid date`,
          });
        }
        break;

      case 'select':
        if (field.options?.list) {
          const validValues = field.options.list.map((item) => item.value);
          if (!validValues.includes(value as string)) {
            errors.push({
              field: path,
              message: `${field.title} must be one of: ${validValues.join(', ')}`,
            });
          }
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push({
            field: path,
            message: `${field.title} must be an array`,
          });
        } else if (field.of && field.of.length > 0) {
          value.forEach((item: unknown, index: number) => {
            this.validateField(
              field.of![0],
              item,
              `${path}[${index}]`,
              errors
            );
          });
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value)) {
          errors.push({
            field: path,
            message: `${field.title} must be an object`,
          });
        } else if (field.fields) {
          for (const subField of field.fields) {
            this.validateField(
              subField,
              (value as Record<string, unknown>)[subField.name],
              `${path}.${subField.name}`,
              errors
            );
          }
        }
        break;

      case 'reference':
        if (typeof value !== 'string') {
          errors.push({
            field: path,
            message: `${field.title} must be a reference ID (string)`,
          });
        }
        break;

      case 'image':
      case 'file':
        if (typeof value !== 'string' && typeof value !== 'object') {
          errors.push({
            field: path,
            message: `${field.title} must be a file reference`,
          });
        }
        break;
    }
  }

  private validateStringOptions(
    field: FieldDefinition,
    value: string,
    path: string,
    errors: ValidationError[]
  ) {
    if (field.options?.maxLength && value.length > field.options.maxLength) {
      errors.push({
        field: path,
        message: `${field.title} must be at most ${field.options.maxLength} characters`,
      });
    }

    if (field.validation?.regex) {
      const regex = new RegExp(field.validation.regex);
      if (!regex.test(value)) {
        errors.push({
          field: path,
          message: `${field.title} does not match the required format`,
        });
      }
    }

    if (field.validation?.min && value.length < field.validation.min) {
      errors.push({
        field: path,
        message: `${field.title} must be at least ${field.validation.min} characters`,
      });
    }

    if (field.validation?.max && value.length > field.validation.max) {
      errors.push({
        field: path,
        message: `${field.title} must be at most ${field.validation.max} characters`,
      });
    }

    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push({
          field: path,
          message: `${field.title} must be a valid email`,
        });
      }
    }

    if (field.type === 'url') {
      try {
        new URL(value);
      } catch {
        errors.push({
          field: path,
          message: `${field.title} must be a valid URL`,
        });
      }
    }
  }

  private validateNumberOptions(
    field: FieldDefinition,
    value: number,
    path: string,
    errors: ValidationError[]
  ) {
    if (field.validation?.min !== undefined && value < field.validation.min) {
      errors.push({
        field: path,
        message: `${field.title} must be at least ${field.validation.min}`,
      });
    }

    if (field.validation?.max !== undefined && value > field.validation.max) {
      errors.push({
        field: path,
        message: `${field.title} must be at most ${field.validation.max}`,
      });
    }
  }
}
