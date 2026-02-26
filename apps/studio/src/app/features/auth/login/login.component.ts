import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>CMS Studio</h1>
        <p class="subtitle">Sign in to your account</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="admin@cms.local"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Password"
            />
          </div>

          @if (error) {
            <div class="error">{{ error }}</div>
          }

          <button type="submit" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--gray-100);
      }
      .login-card {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        width: 100%;
        max-width: 400px;
      }
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        color: var(--gray-900);
      }
      .subtitle {
        text-align: center;
        color: var(--gray-500);
        margin-bottom: 1.5rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--gray-700);
        margin-bottom: 0.25rem;
      }
      input {
        width: 100%;
        padding: 0.625rem 0.75rem;
        border: 1px solid var(--gray-300);
        border-radius: 6px;
        font-size: 0.875rem;
      }
      input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
      button {
        width: 100%;
        padding: 0.625rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.5rem;
      }
      button:hover:not(:disabled) {
        background: var(--primary-dark);
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .error {
        color: var(--danger);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  loading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed';
      },
    });
  }
}
