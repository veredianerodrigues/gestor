import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ContentTypeDefinition,
  FieldDefinition,
} from '@cms/shared/interfaces';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (form) {
      <form [formGroup]="form" class="dynamic-form">
        @for (field of schema.fields; track field.name) {
          <div class="form-group">
            <label [for]="field.name">
              {{ field.title }}
              @if (field.required) {
                <span class="required">*</span>
              }
            </label>
            @if (field.description) {
              <p class="field-description">{{ field.description }}</p>
            }

            @switch (field.type) {
              @case ('string') {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  [placeholder]="field.title"
                />
              }
              @case ('slug') {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  [placeholder]="field.title"
                />
              }
              @case ('email') {
                <input
                  [id]="field.name"
                  type="email"
                  [formControlName]="field.name"
                  [placeholder]="field.title"
                />
              }
              @case ('url') {
                <input
                  [id]="field.name"
                  type="url"
                  [formControlName]="field.name"
                  placeholder="https://"
                />
              }
              @case ('number') {
                <input
                  [id]="field.name"
                  type="number"
                  [formControlName]="field.name"
                />
              }
              @case ('text') {
                <textarea
                  [id]="field.name"
                  [formControlName]="field.name"
                  [rows]="field.options?.rows || 4"
                  [placeholder]="field.title"
                ></textarea>
              }
              @case ('richtext') {
                <textarea
                  [id]="field.name"
                  [formControlName]="field.name"
                  rows="8"
                  [placeholder]="field.title"
                ></textarea>
              }
              @case ('boolean') {
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    [formControlName]="field.name"
                  />
                  {{ field.title }}
                </label>
              }
              @case ('date') {
                <input
                  [id]="field.name"
                  type="date"
                  [formControlName]="field.name"
                />
              }
              @case ('datetime') {
                <input
                  [id]="field.name"
                  type="datetime-local"
                  [formControlName]="field.name"
                />
              }
              @case ('select') {
                <select [id]="field.name" [formControlName]="field.name">
                  <option value="">Select...</option>
                  @for (opt of field.options?.list || []; track opt.value) {
                    <option [value]="opt.value">{{ opt.title }}</option>
                  }
                </select>
              }
              @case ('color') {
                <input
                  [id]="field.name"
                  type="color"
                  [formControlName]="field.name"
                />
              }
              @case ('image') {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  placeholder="Image URL or upload reference"
                />
              }
              @case ('file') {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  placeholder="File reference"
                />
              }
              @case ('reference') {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  [placeholder]="'Reference to ' + (field.to || '')"
                />
              }
              @default {
                <input
                  [id]="field.name"
                  type="text"
                  [formControlName]="field.name"
                  [placeholder]="field.title"
                />
              }
            }
          </div>
        }
      </form>
    }
  `,
  styles: [`
    .dynamic-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-group { display: flex; flex-direction: column; }
    label { font-size: 0.875rem; font-weight: 500; color: var(--gray-700); margin-bottom: 0.25rem; }
    .required { color: var(--danger); }
    .field-description { font-size: 0.75rem; color: var(--gray-400); margin-bottom: 0.25rem; }
    input[type="text"],
    input[type="email"],
    input[type="url"],
    input[type="number"],
    input[type="date"],
    input[type="datetime-local"],
    textarea,
    select {
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--gray-300);
      border-radius: 6px;
      font-size: 0.875rem;
      width: 100%;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    textarea { resize: vertical; }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 400;
      cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] { width: auto; }
    input[type="color"] { height: 40px; padding: 4px; cursor: pointer; }
  `],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() schema!: ContentTypeDefinition;
  @Input() data: Record<string, unknown> = {};
  @Output() formChange = new EventEmitter<Record<string, unknown>>();

  form: FormGroup | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['schema'] || changes['data']) {
      this.buildForm();
    }
  }

  private buildForm() {
    if (!this.schema) return;

    const group: Record<string, unknown> = {};

    for (const field of this.schema.fields) {
      const value = this.data[field.name] ?? this.getDefaultValue(field);
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.options?.maxLength) {
        validators.push(Validators.maxLength(field.options.maxLength));
      }
      if (field.validation?.min !== undefined) {
        validators.push(Validators.min(field.validation.min));
      }
      if (field.validation?.max !== undefined) {
        validators.push(Validators.max(field.validation.max));
      }
      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      group[field.name] = [value, validators];
    }

    this.form = this.fb.group(group);

    this.form.valueChanges.subscribe((val) => {
      this.formChange.emit(val);
    });

    // Emit initial values
    this.formChange.emit(this.form.value);
  }

  private getDefaultValue(field: FieldDefinition): unknown {
    switch (field.type) {
      case 'boolean':
        return false;
      case 'number':
        return null;
      case 'array':
        return [];
      default:
        return '';
    }
  }
}
