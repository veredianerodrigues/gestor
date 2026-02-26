import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<LoginResponse['user'] | null>(null);

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.loadUser();
  }

  login(email: string, password: string) {
    return this.api
      .post<LoginResponse>('/auth/login', { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('cms_token', res.access_token);
          localStorage.setItem('cms_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
        })
      );
  }

  logout() {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('cms_token');
  }

  private loadUser() {
    const userData = localStorage.getItem('cms_user');
    if (userData) {
      this.currentUser.set(JSON.parse(userData));
    }
  }
}
