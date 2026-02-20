import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ContentService } from '../../../core/services/content.service';
import { SchemaService } from '../../../core/services/schema.service';
import { ContentTypeDefinition } from '@cms/shared/interfaces';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ToolbarComponent,
    DynamicFormComponent,
  ],
  template: `
    <div class="layout">
      <app-toolbar />
      <div class="layout-body">
        <app-sidebar />
        <main class="main-content">
          @if (schema) {
            <div class="header">
              <h2>{{ isNew ? 'New' : 'Edit' }} {{ schema.title }}</h2>
              <div class="actions">
                <button class="btn-secondary" (click)="onCancel()">Cancel</button>
                <button class="btn-primary" (click)="onSave()">Save</button>
                @if (!isNew) {
                  <button class="btn-success" (click)="onPublish()">Publish</button>
                }
              </div>
            </div>

            <div class="editor-container">
              <app-dynamic-form
                [schema]="schema"
                [data]="data"
                (formChange)="onFormChange($event)"
              />
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; flex-direction: column; height: 100vh; }
    .layout-body { display: flex; flex: 1; overflow: hidden; }
    .main-content { flex: 1; padding: 2rem; overflow-y: auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { font-size: 1.5rem; font-weight: 700; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-primary { padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.875rem; }
    .btn-secondary { padding: 0.5rem 1rem; background: white; color: var(--gray-700); border: 1px solid var(--gray-300); border-radius: 6px; font-weight: 500; font-size: 0.875rem; }
    .btn-success { padding: 0.5rem 1rem; background: var(--success); color: white; border: none; border-radius: 6px; font-weight: 500; font-size: 0.875rem; }
    .editor-container { background: white; border-radius: 8px; border: 1px solid var(--gray-200); padding: 1.5rem; }
  `],
})
export class ContentEditorComponent implements OnInit {
  type = '';
  id = '';
  isNew = true;
  schema: ContentTypeDefinition | null = null;
  data: Record<string, unknown> = {};
  formData: Record<string, unknown> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private schemaService: SchemaService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
      this.id = params['id'];
      this.isNew = !this.id;
      this.loadSchema();
      if (!this.isNew) {
        this.loadContent();
      }
    });
  }

  onFormChange(data: Record<string, unknown>) {
    this.formData = data;
  }

  onSave() {
    if (!this.schema) return;

    if (this.isNew) {
      this.contentService.create(this.type, this.formData).subscribe(() => {
        this.router.navigate(['/content', this.type]);
      });
    } else {
      this.contentService
        .update(this.type, this.id, this.formData)
        .subscribe(() => {
          this.router.navigate(['/content', this.type]);
        });
    }
  }

  onPublish() {
    this.contentService
      .updateStatus(this.type, this.id, 'PUBLISHED')
      .subscribe();
  }

  onCancel() {
    this.router.navigate(['/content', this.type]);
  }

  private loadSchema() {
    this.schemaService.getSchema(this.type).subscribe((schema) => {
      this.schema = schema;
    });
  }

  private loadContent() {
    this.contentService.findOne(this.type, this.id).subscribe((res) => {
      const content = res.data as Record<string, unknown>;
      this.data = (content['data'] as Record<string, unknown>) || {};
    });
  }
}
