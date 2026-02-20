import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { ContentService } from '../../../core/services/content.service';
import { SchemaService } from '../../../core/services/schema.service';
import { ContentTypeDefinition } from '@cms/shared/interfaces';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, ToolbarComponent],
  template: `
    <div class="layout">
      <app-toolbar />
      <div class="layout-body">
        <app-sidebar />
        <main class="main-content">
          @if (schema) {
            <div class="header">
              <h2>{{ schema.title }}</h2>
              <a [routerLink]="['/content', type, 'new']" class="btn-primary">
                + New {{ schema.title }}
              </a>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    @for (field of previewFields; track field) {
                      <th>{{ field }}</th>
                    }
                    <th>Status</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of items; track item['id']) {
                    <tr>
                      @for (field of previewFields; track field) {
                        <td>
                          <a [routerLink]="['/content', type, item['id']]">
                            {{ getFieldValue(item, field) }}
                          </a>
                        </td>
                      }
                      <td>
                        <span class="status-badge" [class]="item['status']?.toLowerCase()">
                          {{ item['status'] }}
                        </span>
                      </td>
                      <td>{{ item['updatedAt'] | date:'short' }}</td>
                    </tr>
                  }
                  @if (items.length === 0) {
                    <tr>
                      <td [attr.colspan]="previewFields.length + 2" class="empty">
                        No content yet. Create your first {{ schema.title }}.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
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
    .btn-primary {
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: white;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
    }
    .btn-primary:hover { background: var(--primary-dark); }
    .table-container { background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--gray-500); background: var(--gray-50); border-bottom: 1px solid var(--gray-200); }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--gray-100); font-size: 0.875rem; }
    td a { color: var(--gray-900); font-weight: 500; }
    td a:hover { color: var(--primary); }
    .status-badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .draft { background: var(--gray-100); color: var(--gray-700); }
    .published { background: #dcfce7; color: #166534; }
    .archived { background: #fef3c7; color: #92400e; }
    .empty { text-align: center; color: var(--gray-500); padding: 2rem !important; }
  `],
})
export class ContentListComponent implements OnInit {
  type = '';
  schema: ContentTypeDefinition | null = null;
  items: Record<string, unknown>[] = [];
  previewFields: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private schemaService: SchemaService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
      this.loadSchema();
      this.loadContent();
    });
  }

  getFieldValue(item: Record<string, unknown>, field: string): string {
    const data = item['data'] as Record<string, unknown> | undefined;
    const value = data?.[field];
    return value !== undefined && value !== null ? String(value) : '';
  }

  private loadSchema() {
    this.schemaService.getSchema(this.type).subscribe((schema) => {
      this.schema = schema;
      this.previewFields = schema.fields
        .filter((f) => ['string', 'text', 'slug', 'email'].includes(f.type))
        .slice(0, 3)
        .map((f) => f.name);
    });
  }

  private loadContent() {
    this.contentService.findAll(this.type).subscribe((res) => {
      this.items = res.data as Record<string, unknown>[];
    });
  }
}
