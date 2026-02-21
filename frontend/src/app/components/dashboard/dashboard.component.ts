import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="margin-top:70px; min-height:100vh; background:var(--ivory); padding-bottom:60px">
      <div class="dash-header">
        <div class="container">
          <div class="dash-welcome">
            <span class="welcome-icon">🙏</span>
            <div>
              <h1>Namaste, {{ auth.currentUser?.name?.split(' ')![0] }}!</h1>
              <p>Here's an overview of your upcoming celebrations</p>
            </div>
          </div>
          <a routerLink="/events" class="btn-primary">+ Plan New Event</a>
        </div>
      </div>

      <div class="container" style="padding: 40px 20px">
        <!-- STATS ROW -->
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-icon">🎊</div>
            <div class="stat-value">{{ events().length }}</div>
            <div class="stat-label">Events Planned</div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">📸</div>
            <div class="stat-value">{{ bookings().length }}</div>
            <div class="stat-label">Vendor Bookings</div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ confirmedCount() }}</div>
            <div class="stat-label">Confirmed</div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">💰</div>
            <div class="stat-value">₹{{ totalBudget() | number }}</div>
            <div class="stat-label">Total Budget</div>
          </div>
        </div>

        <div class="dash-grid">
          <!-- EVENTS -->
          <div class="dash-section">
            <div class="section-header">
              <h2>My Events</h2>
              <a routerLink="/events" class="see-all">Manage All →</a>
            </div>
            @if(events().length === 0) {
              <div class="empty-state">
                <span>🎊</span>
                <p>No events yet. <a routerLink="/events">Plan your first event!</a></p>
              </div>
            } @else {
              @for(event of events().slice(0, 5); track event.id) {
                <div class="event-row">
                  <div class="event-row-icon">{{ getEventIcon(event.type) }}</div>
                  <div class="event-row-info">
                    <h4>{{ event.name }}</h4>
                    <p>{{ event.eventDate | date:'mediumDate' }} • {{ event.city }}, {{ event.stateName }}</p>
                  </div>
                  <span class="status-badge" [class]="'status-' + event.status">{{ event.status }}</span>
                </div>
              }
            }
          </div>

          <!-- BOOKINGS -->
          <div class="dash-section">
            <div class="section-header">
              <h2>Vendor Bookings</h2>
            </div>
            @if(bookings().length === 0) {
              <div class="empty-state">
                <span>📸</span>
                <p>No bookings yet. Add vendors for your events.</p>
              </div>
            } @else {
              @for(booking of bookings().slice(0, 5); track booking.id) {
                <div class="event-row">
                  <div class="event-row-icon">{{ getServiceIcon(booking.serviceType) }}</div>
                  <div class="event-row-info">
                    <h4>{{ booking.vendorName }}</h4>
                    <p>{{ booking.serviceType }} • {{ booking.serviceDate | date:'mediumDate' }}</p>
                  </div>
                  <div class="booking-amount">₹{{ booking.amount | number }}</div>
                </div>
              }
            }
          </div>
        </div>

        <!-- QUICK LINKS -->
        <div class="quick-links">
          <h2>Quick Actions</h2>
          <div class="quick-grid">
            <a routerLink="/states" class="quick-card">
              <span>🗺️</span>
              <p>Explore States</p>
            </a>
            <a routerLink="/rituals" class="quick-card">
              <span>🙏</span>
              <p>Browse Rituals</p>
            </a>
            <a routerLink="/events" class="quick-card">
              <span>📅</span>
              <p>My Events</p>
            </a>
            <a routerLink="/register" class="quick-card">
              <span>👤</span>
              <p>My Profile</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash-header { background: linear-gradient(135deg, var(--dark-bg), #3D1A00); padding: 36px 0; }
    .dash-header .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .dash-welcome { display: flex; align-items: center; gap: 16px; }
    .welcome-icon { font-size: 2.5rem; }
    .dash-welcome h1 { font-size: 1.8rem; color: var(--gold); margin-bottom: 4px; }
    .dash-welcome p { color: rgba(255,255,255,0.7); font-size: 0.9rem; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
    @media(max-width:768px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:400px) { .stats-row { grid-template-columns: 1fr 1fr; } }
    .stat-box { background: white; border-radius: 16px; padding: 24px; text-align: center; box-shadow: var(--shadow-warm); }
    .stat-icon { font-size: 1.8rem; margin-bottom: 8px; }
    .stat-value { font-family: 'Yeseva One', serif; font-size: 2rem; color: var(--deep-red); }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
    .dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px; }
    @media(max-width:768px) { .dash-grid { grid-template-columns: 1fr; } }
    .dash-section { background: white; border-radius: 20px; padding: 28px; box-shadow: var(--shadow-warm); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header h2 { font-size: 1.2rem; color: var(--text-dark); }
    .see-all { color: var(--saffron); font-weight: 700; text-decoration: none; font-size: 0.9rem; }
    .empty-state { text-align: center; padding: 30px; color: var(--text-muted); }
    .empty-state span { font-size: 2.5rem; display: block; margin-bottom: 12px; }
    .empty-state a { color: var(--saffron); font-weight: 700; text-decoration: none; }
    .event-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border-light); }
    .event-row:last-child { border-bottom: none; }
    .event-row-icon { font-size: 1.5rem; flex-shrink: 0; }
    .event-row-info { flex: 1; }
    .event-row-info h4 { font-size: 0.95rem; color: var(--text-dark); margin-bottom: 2px; }
    .event-row-info p { font-size: 0.8rem; color: var(--text-muted); }
    .status-badge { padding: 4px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
    .status-planning { background: #FFF3E0; color: var(--saffron); }
    .status-confirmed { background: #E8F5E9; color: var(--forest-green); }
    .status-completed { background: #E3F2FD; color: #1565C0; }
    .status-cancelled { background: #FFEBEE; color: var(--deep-red); }
    .booking-amount { font-weight: 700; color: var(--forest-green); font-size: 0.9rem; }
    .quick-links h2 { font-size: 1.3rem; color: var(--text-dark); margin-bottom: 16px; }
    .quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media(max-width:600px) { .quick-grid { grid-template-columns: repeat(2, 1fr); } }
    .quick-card { display: flex; flex-direction: column; align-items: center; gap: 10px; background: white; border-radius: 16px; padding: 24px; text-decoration: none; color: inherit; box-shadow: var(--shadow-warm); transition: all 0.2s; text-align: center; }
    .quick-card:hover { transform: translateY(-4px); }
    .quick-card span { font-size: 2rem; }
    .quick-card p { font-weight: 600; color: var(--text-dark); font-size: 0.9rem; }
  `]
})
export class DashboardComponent implements OnInit {
  events = signal<any[]>([]);
  bookings = signal<any[]>([]);
  confirmedCount = signal(0);
  totalBudget = signal(0);

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getEvents().subscribe(events => {
      this.events.set(events);
      this.confirmedCount.set(events.filter(e => e.status === 'confirmed').length);
      this.totalBudget.set(events.reduce((sum, e) => sum + (e.budget || 0), 0));
    });
    this.api.getBookings().subscribe(bookings => this.bookings.set(bookings));
  }

  getEventIcon(type: string): string {
    const map: any = { wedding:'💒', engagement:'💍', childbirth:'👶', mundan:'✂️', festival:'🎊' };
    return map[type] || '🎭';
  }

  getServiceIcon(type: string): string {
    const map: any = { photographer:'📸', caterer:'🍽️', decorator:'🌸', pundit:'🙏', dj:'🎵', venue:'🏛️' };
    return map[type?.toLowerCase()] || '📋';
  }
}
