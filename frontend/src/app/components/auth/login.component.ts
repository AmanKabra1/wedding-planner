import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page" style="margin-top:70px">
      <div class="auth-left">
        <div class="auth-left-content">
          <div class="auth-brand">🪷 Shaadi Vidhaan</div>
          <h2>Welcome Back!</h2>
          <p>Continue planning your perfect Indian celebration with authentic rituals and cultural guidance.</p>
          <div class="auth-features">
            <div class="af">🗺️ State-specific rituals</div>
            <div class="af">📅 Event planning tools</div>
            <div class="af">💰 Budget tracking</div>
            <div class="af">👪 Family coordination</div>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <h1>Login</h1>
          <p class="auth-subtitle">New here? <a routerLink="/register">Create an account →</a></p>

          @if(error()) {
            <div class="error-alert">⚠️ {{ error() }}</div>
          }

          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="email" name="email" placeholder="your@email.com" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-submit" [disabled]="loading()">
              {{ loading() ? 'Logging in...' : 'Login 🙏' }}
            </button>
          </form>

          <div class="auth-divider">or continue with</div>
          <div class="demo-login">
            <p>Demo Account:</p>
            <button (click)="fillDemo()" class="demo-btn">Use Demo Credentials</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 70px); }
    @media(max-width:768px) { .auth-page { grid-template-columns: 1fr; } }
    .auth-left { background: linear-gradient(135deg, var(--deep-red), #8B0020); padding: 60px 40px; display: flex; align-items: center; }
    @media(max-width:768px) { .auth-left { display: none; } }
    .auth-left-content { color: white; }
    .auth-brand { font-family: 'Yeseva One', serif; font-size: 1.8rem; color: var(--gold); margin-bottom: 24px; }
    .auth-left h2 { font-size: 2.5rem; color: white; margin-bottom: 16px; }
    .auth-left p { opacity: 0.85; line-height: 1.7; margin-bottom: 32px; }
    .auth-features { display: flex; flex-direction: column; gap: 12px; }
    .af { background: rgba(255,255,255,0.15); padding: 12px 20px; border-radius: 10px; font-weight: 600; }
    .auth-right { display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: var(--ivory); }
    .auth-form-container { width: 100%; max-width: 400px; }
    .auth-form-container h1 { font-size: 2rem; color: var(--text-dark); margin-bottom: 8px; }
    .auth-subtitle { color: var(--text-muted); margin-bottom: 28px; }
    .auth-subtitle a { color: var(--saffron); font-weight: 700; text-decoration: none; }
    .error-alert { background: #FFEBEE; color: var(--deep-red); padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .btn-submit { width: 100%; background: linear-gradient(135deg, var(--saffron), var(--deep-red)); color: white; border: none; padding: 14px; border-radius: 50px; font-size: 1rem; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-top: 8px; }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,0,0.4); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    .auth-divider { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin: 20px 0; }
    .demo-login { text-align: center; }
    .demo-login p { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 8px; }
    .demo-btn { background: #FFF3E0; border: 1px solid var(--border-light); padding: 8px 20px; border-radius: 20px; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 0.85rem; color: var(--warm-brown); }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid credentials. Please try again.');
        this.loading.set(false);
      }
    });
  }

  fillDemo() {
    this.email = 'demo@shaadividhaan.in';
    this.password = 'Demo@1234';
  }
}
