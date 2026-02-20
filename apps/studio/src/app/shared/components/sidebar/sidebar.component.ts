import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SchemaService } from '../../../core/services/schema.service';
import { ContentTypeDefinition } from '@cms/shared/interfaces';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <nav>
        <div class="nav-section">
          <span class="nav-section-title">Content</span>
          @for (schema of schemas; track schema.name) {
            <a
              [routerLink]="['/content', schema.name]"
              routerLinkActive="active"
              class="nav-item"
            >
              <span class="material-icons">{{ schema.icon || 'description' }}</span>
              {{ schema.title }}
            </a>
          }
        </div>

        <div class="nav-section">
          <span class="nav-section-title">Assets</span>
          <a routerLink="/media" routerLinkActive="active" class="nav-item">
            <span class="material-icons">perm_media</span>
            Media
          </a>
        </div>

        <div class="nav-section">
          <span class="nav-section-title">Settings</span>
          <a routerLink="/users" routerLinkActive="active" class="nav-item">
            <span class="material-icons">people</span>
            Users
          </a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      min-width: var(--sidebar-width);
      background: white;
      border-right: 1px solid var(--gray-200);
      overflow-y: auto;
      padding: 1rem 0;
    }
    .nav-section { margin-bottom: 1.5rem; }
    .nav-section-title {
      display: block;
      padding: 0 1rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--gray-400);
      margin-bottom: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: var(--gray-600);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
    }
    .nav-item:hover { background: var(--gray-50); color: var(--gray-900); }
    .nav-item.active { background: rgba(37, 99, 235, 0.05); color: var(--primary); }
    .nav-item .material-icons { font-size: 1.25rem; }
  `],
})
export class SidebarComponent implements OnInit {
  schemas: ContentTypeDefinition[] = [];

  constructor(private schemaService: SchemaService) {}

  ngOnInit() {
    const cached = this.schemaService.schemas();
    if (cached.length > 0) {
      this.schemas = cached;
    } else {
      this.schemaService.loadSchemas().subscribe((schemas) => {
        this.schemas = schemas;
        this.schemaService.schemas.set(schemas);
      });
    }
  }
}
