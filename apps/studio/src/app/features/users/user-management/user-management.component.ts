import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ToolbarComponent],
  template: `
    <div class="layout">
      <app-toolbar />
      <div class="layout-body">
        <app-sidebar />
        <main class="main-content">
          <div class="header">
            <h2>Users</h2>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users; track user['id']) {
                  <tr>
                    <td>{{ user['name'] }}</td>
                    <td>{{ user['email'] }}</td>
                    <td><span class="role-badge">{{ user['role'] }}</span></td>
                    <td>{{ user['createdAt'] | date:'short' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
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
    .table-container { background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--gray-500); background: var(--gray-50); border-bottom: 1px solid var(--gray-200); }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--gray-100); font-size: 0.875rem; }
    .role-badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background: var(--gray-100); color: var(--gray-700); }
  `],
})
export class UserManagementComponent implements OnInit {
  users: Record<string, unknown>[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<{ data: Record<string, unknown>[] }>('/users').subscribe((res) => {
      this.users = res.data;
    });
  }
}
