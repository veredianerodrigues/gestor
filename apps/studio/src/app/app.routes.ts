import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'content/:type',
        loadComponent: () =>
          import(
            './features/content/content-list/content-list.component'
          ).then((m) => m.ContentListComponent),
      },
      {
        path: 'content/:type/new',
        loadComponent: () =>
          import(
            './features/content/content-editor/content-editor.component'
          ).then((m) => m.ContentEditorComponent),
      },
      {
        path: 'content/:type/:id',
        loadComponent: () =>
          import(
            './features/content/content-editor/content-editor.component'
          ).then((m) => m.ContentEditorComponent),
      },
      {
        path: 'media',
        loadComponent: () =>
          import(
            './features/media/media-library/media-library.component'
          ).then((m) => m.MediaLibraryComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import(
            './features/users/user-management/user-management.component'
          ).then((m) => m.UserManagementComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
