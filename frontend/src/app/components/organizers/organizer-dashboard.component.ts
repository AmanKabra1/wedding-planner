import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

const EVENT_TYPES = ['wedding','engagement','mundan','griha-pravesh','upanayana','festival','childbirth'];
const STATES = ['Rajasthan','Maharashtra','Punjab','Tamil Nadu','Gujarat','West Bengal','Kerala','Uttar Pradesh','Karnataka','Andhra Pradesh','Himachal Pradesh','Goa','Odisha','Assam','Madhya Pradesh'];

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="margin-top:70px; min-height:100vh; background:var(--ivory); padding-bottom:60px">

      <!-- NOT LOGGED IN -->
      @if(!loggedIn()) {
        <div class="auth-page">
          <div class="auth-tabs">
            <button [class.active]="authTab() === 'login'" (click)="authTab.set('login')">Login as Organizer</button>
            <button [class.active]="authTab() === 'register'" (click)="authTab.set('register')">Register as Organizer</button>
          </div>

          @if(authTab() === 'login') {
            <!-- LOGIN -->
            <div class="auth-card">
              <div class="auth-icon">🏢</div>
              <h2>Organizer Login</h2>
              <p>Manage your packages and pricing</p>
              @if(authError()) { <div class="error-alert">⚠️ {{ authError() }}</div> }
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="loginForm.email" placeholder="your@business.com">
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" [(ngModel)]="loginForm.password" placeholder="••••••••">
              </div>
              <button class="btn-submit" (click)="doLogin()" [disabled]="authLoading()">
                {{ authLoading() ? 'Logging in...' : 'Login 🙏' }}
              </button>
              <p class="demo-note">Demo: royal&#64;rajasthanevents.com / Demo&#64;1234</p>
            </div>
          } @else {
            <!-- REGISTER -->
            <div class="auth-card wide">
              <div class="auth-icon">✨</div>
              <h2>Register as Organizer</h2>
              <p>Create your profile and start listing packages</p>
              @if(authError()) { <div class="error-alert">⚠️ {{ authError() }}</div> }
              <div class="form-grid">
                <div class="form-group">
                  <label>Business Name *</label>
                  <input type="text" [(ngModel)]="registerForm.businessName" placeholder="ABC Events Co.">
                </div>
                <div class="form-group">
                  <label>Owner Name *</label>
                  <input type="text" [(ngModel)]="registerForm.ownerName" placeholder="Ramesh Sharma">
                </div>
                <div class="form-group">
                  <label>Email *</label>
                  <input type="email" [(ngModel)]="registerForm.email" placeholder="your@email.com">
                </div>
                <div class="form-group">
                  <label>Phone *</label>
                  <input type="tel" [(ngModel)]="registerForm.phone" placeholder="6378781547">
                </div>
                <div class="form-group">
                  <label>WhatsApp</label>
                  <input type="tel" [(ngModel)]="registerForm.whatsapp" placeholder="6378781547">
                </div>
                <div class="form-group">
                  <label>City</label>
                  <input type="text" [(ngModel)]="registerForm.city" placeholder="Jaipur">
                </div>
                <div class="form-group">
                  <label>State</label>
                  <select [(ngModel)]="registerForm.state">
                    <option value="">Select state</option>
                    @for(s of states; track s) { <option>{{ s }}</option> }
                  </select>
                </div>
                <div class="form-group">
                  <label>Years of Experience</label>
                  <input type="number" [(ngModel)]="registerForm.experienceYears" placeholder="5">
                </div>
              </div>
              <div class="form-group">
                <label>Business Description</label>
                <textarea [(ngModel)]="registerForm.description" placeholder="Tell customers about your services..."></textarea>
              </div>
              <div class="form-group">
                <label>Password *</label>
                <input type="password" [(ngModel)]="registerForm.password" placeholder="Min 8 characters">
              </div>
              <button class="btn-submit" (click)="doRegister()" [disabled]="authLoading()">
                {{ authLoading() ? 'Creating Account...' : 'Create Account 🎊' }}
              </button>
            </div>
          }
        </div>
      }

      <!-- LOGGED IN DASHBOARD -->
      @if(loggedIn()) {
        <div class="dash-header">
          <div class="container">
            <div>
              <h1>🏢 {{ organizer()!.businessName }}</h1>
              <p>{{ organizer()!.city }}, {{ organizer()!.state }} • Manage your packages & pricing</p>
            </div>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </div>
        </div>

        <div class="container" style="padding: 32px 20px">

          <!-- STATS -->
          <div class="stats-row">
            <div class="stat-box">
              <div class="stat-icon">📦</div>
              <div class="stat-val">{{ prices().length }}</div>
              <div class="stat-lbl">Packages Listed</div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">⭐</div>
              <div class="stat-val">{{ organizer()!.rating }}</div>
              <div class="stat-lbl">Rating</div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">🎊</div>
              <div class="stat-val">{{ organizer()!.eventsCompleted }}</div>
              <div class="stat-lbl">Events Done</div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">{{ organizer()!.isVerified ? '✅' : '⏳' }}</div>
              <div class="stat-val">{{ organizer()!.isVerified ? 'Verified' : 'Pending' }}</div>
              <div class="stat-lbl">Status</div>
            </div>
          </div>

          <!-- ADD PACKAGE FORM -->
          <div class="section-card">
            <div class="section-top">
              <h2>📦 My Packages</h2>
              <button class="btn-add" (click)="showPriceForm.set(!showPriceForm())">
                {{ showPriceForm() ? '✕ Cancel' : '+ Add Package' }}
              </button>
            </div>

            @if(showPriceForm()) {
              <div class="price-form">
                <h3>{{ editingPrice() ? 'Edit Package' : 'New Package' }}</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Package Name *</label>
                    <input type="text" [(ngModel)]="priceForm.packageName" placeholder="Gold Wedding Package">
                  </div>
                  <div class="form-group">
                    <label>Event Type *</label>
                    <select [(ngModel)]="priceForm.eventType">
                      <option value="">Select type</option>
                      @for(t of eventTypes; track t) { <option [value]="t">{{ t }}</option> }
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Starting Price (₹) *</label>
                    <input type="number" [(ngModel)]="priceForm.basePrice" placeholder="50000">
                  </div>
                  <div class="form-group">
                    <label>Max Price (₹)</label>
                    <input type="number" [(ngModel)]="priceForm.maxPrice" placeholder="150000">
                  </div>
                  <div class="form-group">
                    <label>Price Unit</label>
                    <select [(ngModel)]="priceForm.priceUnit">
                      <option>per event</option>
                      <option>per day</option>
                      <option>per person</option>
                      <option>per plate</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Min Guests</label>
                    <input type="number" [(ngModel)]="priceForm.guestCountMin" placeholder="50">
                  </div>
                  <div class="form-group">
                    <label>Max Guests</label>
                    <input type="number" [(ngModel)]="priceForm.guestCountMax" placeholder="300">
                  </div>
                  <div class="form-group checkbox-group">
                    <label>
                      <input type="checkbox" [(ngModel)]="priceForm.isNegotiable">
                      Price is Negotiable
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label>Package Description</label>
                  <textarea [(ngModel)]="priceForm.packageDescription" placeholder="Describe what makes this package great..."></textarea>
                </div>
                <div class="form-group">
                  <label>What's Included (one per line)</label>
                  <textarea [(ngModel)]="inclusionsText" placeholder="Basic decoration&#10;Pandit/Priest&#10;Photography 4hrs&#10;Catering 100 guests"></textarea>
                </div>
                <div class="form-group">
                  <label>Not Included (one per line)</label>
                  <textarea [(ngModel)]="exclusionsText" placeholder="Venue cost&#10;Bridal makeup&#10;Videography"></textarea>
                </div>
                <div class="form-actions">
                  <button class="btn-primary" (click)="savePrice()">
                    {{ editingPrice() ? 'Update Package' : 'Add Package 🎊' }}
                  </button>
                  <button class="btn-secondary" (click)="cancelPriceForm()">Cancel</button>
                </div>
              </div>
            }

            <!-- PACKAGES LIST -->
            @if(prices().length === 0) {
              <div class="empty-state">
                <span>📦</span>
                <p>No packages yet. Add your first package!</p>
              </div>
            } @else {
              <div class="packages-list">
                @for(pkg of prices(); track pkg.id) {
                  <div class="pkg-row">
                    <div class="pkg-row-info">
                      <div class="pkg-row-top">
                        <h4>{{ pkg.packageName }}</h4>
                        <span class="event-tag">{{ pkg.eventType }}</span>
                      </div>
                      <div class="pkg-row-price">
                        ₹{{ pkg.basePrice | number }}
                        @if(pkg.maxPrice) { – ₹{{ pkg.maxPrice | number }} }
                        / {{ pkg.priceUnit }}
                      </div>
                      <div class="pkg-row-meta">
                        👥 {{ pkg.guestCountMin }}–{{ pkg.guestCountMax }} guests
                        @if(pkg.isNegotiable) { • 🤝 Negotiable }
                      </div>
                    </div>
                    <div class="pkg-row-actions">
                      <button class="btn-edit" (click)="editPrice(pkg)">✏️ Edit</button>
                      <button class="btn-del" (click)="deletePrice(pkg.id)">🗑️ Delete</button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- CONTACT INFO -->
          <div class="section-card">
            <h2>📞 Your Contact Info</h2>
            <p style="color:var(--text-muted);margin-bottom:16px">This is shown to customers on the organizers page</p>
            <div class="contact-display">
              <div class="contact-item">📞 {{ organizer()!.phone }}</div>
              <div class="contact-item">💬 WhatsApp: {{ organizer()!.whatsapp }}</div>
              <div class="contact-item">✉️ {{ organizer()!.email }}</div>
              <div class="contact-item">📍 {{ organizer()!.city }}, {{ organizer()!.state }}</div>
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    /* AUTH */
    .auth-page { max-width: 700px; margin: 40px auto; padding: 0 20px; }
    .auth-tabs { display: flex; gap: 0; margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 2px solid var(--border-light); }
    .auth-tabs button { flex: 1; padding: 14px; border: none; background: white; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
    .auth-tabs button.active { background: linear-gradient(135deg, var(--saffron), var(--deep-red)); color: white; }
    .auth-card { background: white; border-radius: 20px; padding: 36px; box-shadow: var(--shadow-warm); text-align: center; }
    .auth-card.wide { text-align: left; }
    .auth-icon { font-size: 3rem; margin-bottom: 12px; }
    .auth-card h2 { font-size: 1.6rem; color: var(--text-dark); margin-bottom: 6px; }
    .auth-card p { color: var(--text-muted); margin-bottom: 24px; }
    .error-alert { background: #FFEBEE; color: var(--deep-red); padding: 12px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 0.9rem; text-align: left; }
    .btn-submit { width: 100%; background: linear-gradient(135deg, var(--saffron), var(--deep-red)); color: white; border: none; padding: 14px; border-radius: 50px; font-size: 1rem; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-top: 8px; }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,0,0.4); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    .demo-note { margin-top: 14px; font-size: 0.82rem; color: var(--text-muted); }

    /* DASHBOARD */
    .dash-header { background: linear-gradient(135deg, #1B5E20, #2E7D32); padding: 32px 0; color: white; }
    .dash-header .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    .dash-header h1 { color: white; font-size: 1.6rem; margin-bottom: 4px; }
    .dash-header p { color: rgba(255,255,255,0.8); font-size: 0.9rem; }
    .btn-logout { background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); padding: 8px 20px; border-radius: 20px; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 600; }

    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    @media(max-width:700px) { .stats-row { grid-template-columns: repeat(2,1fr); } }
    .stat-box { background: white; border-radius: 16px; padding: 20px; text-align: center; box-shadow: var(--shadow-warm); }
    .stat-icon { font-size: 1.6rem; margin-bottom: 8px; }
    .stat-val { font-family: 'Yeseva One', serif; font-size: 1.6rem; color: var(--deep-red); }
    .stat-lbl { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }

    .section-card { background: white; border-radius: 20px; padding: 28px; box-shadow: var(--shadow-warm); margin-bottom: 24px; }
    .section-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-top h2 { font-size: 1.2rem; color: var(--text-dark); }
    .btn-add { background: linear-gradient(135deg, var(--saffron), var(--deep-red)); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.9rem; }

    .price-form { background: #FFF8F0; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .price-form h3 { font-size: 1.1rem; color: var(--text-dark); margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } }
    .checkbox-group { display: flex; align-items: center; padding-top: 28px; }
    .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600; }
    .form-actions { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }

    .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }
    .empty-state span { font-size: 2.5rem; display: block; margin-bottom: 12px; }

    .packages-list { display: flex; flex-direction: column; gap: 12px; }
    .pkg-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 20px; border: 2px solid var(--border-light); border-radius: 14px; gap: 12px; flex-wrap: wrap; }
    .pkg-row-top { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
    .pkg-row-top h4 { font-size: 1rem; color: var(--text-dark); }
    .event-tag { background: #FFF3E0; color: var(--saffron); padding: 3px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; }
    .pkg-row-price { font-family: 'Yeseva One', serif; color: #1B5E20; font-size: 1.1rem; margin-bottom: 4px; }
    .pkg-row-meta { font-size: 0.82rem; color: var(--text-muted); }
    .pkg-row-actions { display: flex; gap: 8px; flex-shrink: 0; }
    .btn-edit { background: #FFF3E0; border: none; padding: 7px 14px; border-radius: 12px; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: var(--warm-brown); }
    .btn-del { background: #FFEBEE; border: none; padding: 7px 14px; border-radius: 12px; cursor: pointer; font-size: 0.82rem; font-weight: 600; color: var(--deep-red); }

    .contact-display { display: flex; flex-direction: column; gap: 12px; }
    .contact-item { background: #FFF8F0; padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; color: var(--text-dark); font-weight: 600; }

    /* Shared form styles */
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 6px; color: var(--warm-brown); font-size: 0.88rem; }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%; padding: 11px 14px; border: 2px solid #E8D8C0;
      border-radius: 10px; font-family: 'Nunito', sans-serif;
      font-size: 0.95rem; color: var(--text-dark);
      background: white; outline: none; transition: border-color 0.2s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--saffron); }
    .form-group textarea { min-height: 90px; resize: vertical; }
    .btn-primary { background: linear-gradient(135deg, var(--saffron), var(--deep-red)); color: white; border: none; padding: 12px 28px; border-radius: 30px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary { background: transparent; color: var(--deep-red); border: 2px solid var(--deep-red); padding: 10px 24px; border-radius: 30px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; }
  `]
})
export class OrganizerDashboardComponent implements OnInit {
  loggedIn = signal(false);
  organizer = signal<any>(null);
  prices = signal<any[]>([]);
  authTab = signal<'login' | 'register'>('login');
  authError = signal('');
  authLoading = signal(false);
  showPriceForm = signal(false);
  editingPrice = signal<any>(null);

  loginForm = { email: '', password: '' };
  registerForm: any = { businessName: '', ownerName: '', email: '', phone: '', whatsapp: '', city: '', state: '', experienceYears: 0, description: '', password: '' };
  priceForm: any = { packageName: '', eventType: '', basePrice: 0, maxPrice: null, priceUnit: 'per event', packageDescription: '', guestCountMin: 0, guestCountMax: 0, isNegotiable: true };
  inclusionsText = '';
  exclusionsText = '';

  eventTypes = EVENT_TYPES;
  states = STATES;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const saved = localStorage.getItem('organizer');
    if (saved) {
      const org = JSON.parse(saved);
      this.organizer.set(org);
      this.loggedIn.set(true);
      this.loadPrices(org.id);
    }
  }

  doLogin() {
    this.authLoading.set(true);
    this.authError.set('');
    this.api.organizerLogin(this.loginForm).subscribe({
      next: (org) => {
        localStorage.setItem('organizer', JSON.stringify(org));
        this.organizer.set(org);
        this.loggedIn.set(true);
        this.loadPrices(org.id);
        this.authLoading.set(false);
      },
      error: (err) => {
        this.authError.set(err.error?.message || 'Invalid credentials');
        this.authLoading.set(false);
      }
    });
  }

  doRegister() {
    this.authLoading.set(true);
    this.authError.set('');
    this.api.organizerRegister(this.registerForm).subscribe({
      next: (org) => {
        localStorage.setItem('organizer', JSON.stringify(org));
        this.organizer.set(org);
        this.loggedIn.set(true);
        this.authLoading.set(false);
      },
      error: (err) => {
        this.authError.set(err.error?.message || 'Registration failed');
        this.authLoading.set(false);
      }
    });
  }

  logout() {
    localStorage.removeItem('organizer');
    this.loggedIn.set(false);
    this.organizer.set(null);
    this.prices.set([]);
  }

  loadPrices(organizerId: number) {
    this.api.getOrganizerPrices(undefined, organizerId).subscribe(p => this.prices.set(p));
  }

  savePrice() {
    const data = {
      ...this.priceForm,
      organizerId: this.organizer()!.id,
      inclusions: this.inclusionsText.split('\n').filter(l => l.trim()),
      exclusions: this.exclusionsText.split('\n').filter(l => l.trim()),
    };
    const obs = this.editingPrice()
      ? this.api.updateOrganizerPrice(this.editingPrice().id, data)
      : this.api.addOrganizerPrice(data);
    obs.subscribe(() => {
      this.cancelPriceForm();
      this.loadPrices(this.organizer()!.id);
    });
  }

  editPrice(pkg: any) {
    this.editingPrice.set(pkg);
    this.priceForm = { ...pkg };
    this.inclusionsText = (pkg.inclusions || []).join('\n');
    this.exclusionsText = (pkg.exclusions || []).join('\n');
    this.showPriceForm.set(true);
  }

  cancelPriceForm() {
    this.editingPrice.set(null);
    this.priceForm = { packageName: '', eventType: '', basePrice: 0, maxPrice: null, priceUnit: 'per event', packageDescription: '', guestCountMin: 0, guestCountMax: 0, isNegotiable: true };
    this.inclusionsText = '';
    this.exclusionsText = '';
    this.showPriceForm.set(false);
  }

  deletePrice(id: number) {
    if (confirm('Delete this package?')) {
      this.api.deleteOrganizerPrice(id).subscribe(() => this.loadPrices(this.organizer()!.id));
    }
  }
}