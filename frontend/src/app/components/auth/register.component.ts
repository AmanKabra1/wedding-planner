import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page" style="margin-top:70px">
      <div class="auth-left">
        <div class="auth-left-content">
          <div class="auth-brand">🪷 Shaadi Vidhaan</div>
          <h2>Join Us!</h2>
          <p>Start your journey to plan an authentic, culturally rich Indian celebration.</p>
          <div class="celebration-icons">
            <span>🎊</span><span>💍</span><span>🙏</span><span>🪔</span><span>🌸</span>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <h1>Create Account</h1>
          <p class="auth-subtitle">Already have an account? <a routerLink="/login">Login →</a></p>

          @if(error()) {
            <div class="error-alert">⚠️ {{ error() }}</div>
          }

          <form (ngSubmit)="onRegister()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="form.name" name="name" placeholder="Priya Sharma" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" [(ngModel)]="form.email" name="email" placeholder="priya@email.com" required>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" [(ngModel)]="form.phone" name="phone" placeholder="+91 98765 43210">
            </div>
            <div class="form-group">
              <label>Your State</label>
              <select [(ngModel)]="form.state" name="state">
                <option value="">Select your state</option>
                @for(state of states; track state) {
                  <option [value]="state">{{ state }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="form.password" name="password" placeholder="Min 8 characters" required minlength="8">
            </div>
            <button type="submit" class="btn-submit" [disabled]="loading()">
              {{ loading() ? 'Creating Account...' : 'Create Account 🎊' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 70px); }
    @media(max-width:768px) { .auth-page { grid-template-columns: 1fr; } }
    .auth-left { background: linear-gradient(135deg, #FF6B00, #B5002B); padding: 60px 40px; display: flex; align-items: center; }
    @media(max-width:768px) { .auth-left { display: none; } }
    .auth-left-content { color: white; }
    .auth-brand { font-family: 'Yeseva One', serif; font-size: 1.8rem; color: var(--gold); margin-bottom: 24px; }
    .auth-left h2 { font-size: 2.5rem; color: white; margin-bottom: 16px; }
    .auth-left p { opacity: 0.85; line-height: 1.7; margin-bottom: 32px; }
    .celebration-icons { font-size: 3rem; display: flex; gap: 16px; flex-wrap: wrap; }
    .auth-right { display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: var(--ivory); overflow-y: auto; }
    .auth-form-container { width: 100%; max-width: 400px; }
    .auth-form-container h1 { font-size: 2rem; color: var(--text-dark); margin-bottom: 8px; }
    .auth-subtitle { color: var(--text-muted); margin-bottom: 28px; }
    .auth-subtitle a { color: var(--saffron); font-weight: 700; text-decoration: none; }
    .error-alert { background: #FFEBEE; color: var(--deep-red); padding: 12px 16px; border-radius: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .btn-submit { width: 100%; background: linear-gradient(135deg, var(--saffron), var(--deep-red)); color: white; border: none; padding: 14px; border-radius: 50px; font-size: 1rem; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-top: 8px; }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,0,0.4); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
  `]
})
export class RegisterComponent {
  form = { name: '', email: '', phone: '', state: '', password: '' };
  loading = signal(false);
  error = signal('');
  states = STATES;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
