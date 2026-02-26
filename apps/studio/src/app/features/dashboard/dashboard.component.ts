import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { SchemaService } from '../../core/services/schema.service';
import { ContentTypeDefinition } from '@cms/shared/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, ToolbarComponent],
  template: `
    <div class="layout">
      <app-toolbar />
      <div class="layout-body">
        <app-sidebar />
        <main class="main-content">
          <h2>Dashboard</h2>
          <p class="description">Welcome to CMS Studio. Select a content type from the sidebar to get started.</p>

          <div class="cards">
            @for (schema of schemas; track schema.name) {
              <a [routerLink]="['/content', schema.name]" class="card">
                <span class="material-icons icon">{{ schema.icon || 'description' }}</span>
                <h3>{{ schema.title }}</h3>
                <p>{{ schema.description || 'Manage ' + schema.title }}</p>
              </a>
            }
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; flex-direction: column; height: 100vh; }
    .layout-body { display: flex; flex: 1; overflow: hidden; }
    .main-content { flex: 1; padding: 2rem; overflow-y: auto; }
    h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .description { color: var(--gray-500); margin-bottom: 2rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--gray-200);
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s, border-color 0.2s;
    }
    .card:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .icon { font-size: 2rem; color: var(--primary); margin-bottom: 0.75rem; }
    .card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem; }
    .card p { color: var(--gray-500); font-size: 0.875rem; }
  `],
})
export class DashboardComponent implements OnInit {
  schemas: ContentTypeDefinition[] = [];

  constructor(private schemaService: SchemaService) {}

  ngOnInit() {
    this.schemaService.loadSchemas().subscribe((schemas) => {
      this.schemas = schemas;
      this.schemaService.schemas.set(schemas);
    });
  }
}
