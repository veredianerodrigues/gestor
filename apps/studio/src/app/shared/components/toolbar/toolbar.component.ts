import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="toolbar">
      <a routerLink="/dashboard" class="logo">CMS Studio</a>

      <div class="toolbar-right">
        @if (auth.currentUser(); as user) {
          <span class="user-name">{{ user.name }}</span>
          <span class="user-role">{{ user.role }}</span>
        }
        <button class="btn-logout" (click)="auth.logout()">
          <span class="material-icons">logout</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .toolbar {
      height: var(--toolbar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      background: white;
      border-bottom: 1px solid var(--gray-200);
    }
    .logo {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--gray-900);
      text-decoration: none;
    }
    .toolbar-right { display: flex; align-items: center; gap: 0.75rem; }
    .user-name { font-size: 0.875rem; font-weight: 500; color: var(--gray-700); }
    .user-role { font-size: 0.75rem; padding: 0.125rem 0.5rem; background: var(--gray-100); color: var(--gray-600); border-radius: 9999px; }
    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.375rem;
      background: none;
      border: none;
      color: var(--gray-400);
      border-radius: 4px;
    }
    .btn-logout:hover { background: var(--gray-100); color: var(--gray-600); }
    .btn-logout .material-icons { font-size: 1.25rem; }
  `],
})
export class ToolbarComponent {
  constructor(public auth: AuthService) {}
}
