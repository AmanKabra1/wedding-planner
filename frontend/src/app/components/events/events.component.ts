import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

const STATES = ['Andhra Pradesh','Assam','Bihar','Goa','Gujarat','Haryana','Himachal Pradesh','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'];

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="margin-top:70px; min-height:100vh; background:var(--ivory); padding-bottom:60px">
      <div class="events-header">
        <div class="container">
          <h1>My Events</h1>
          <button class="btn-primary" (click)="showForm.set(!showForm())">
            {{ showForm() ? '✕ Cancel' : '+ New Event' }}
          </button>
        </div>
      </div>

      <div class="container" style="padding: 32px 20px">
        <!-- CREATE FORM -->
        @if(showForm()) {
          <div class="event-form-card">
            <h2>{{ editing() ? 'Edit Event' : 'Plan New Event' }}</h2>
            <div class="form-grid">
              <div class="form-group">
                <label>Event Name *</label>
                <input type="text" [(ngModel)]="form.name" placeholder="e.g. Priya & Rahul's Wedding">
              </div>
              <div class="form-group">
                <label>Event Type *</label>
                <select [(ngModel)]="form.type">
                  <option value="">Select type</option>
                  <option value="wedding">💒 Wedding</option>
                  <option value="engagement">💍 Engagement</option>
                  <option value="childbirth">👶 Childbirth Ceremony</option>
                  <option value="mundan">✂️ Mundan</option>
                  <option value="festival">🎊 Festival/Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Event Date</label>
                <input type="date" [(ngModel)]="form.eventDate">
              </div>
              <div class="form-group">
                <label>State</label>
                <select [(ngModel)]="form.stateName">
                  <option value="">Select state</option>
                  @for(s of states; track s) { <option>{{ s }}</option> }
                </select>
              </div>
              <div class="form-group">
                <label>City/Venue</label>
                <input type="text" [(ngModel)]="form.city" placeholder="e.g. Jaipur">
              </div>
              <div class="form-group">
                <label>Venue Name</label>
                <input type="text" [(ngModel)]="form.venue" placeholder="e.g. Royal Palace Hotel">
              </div>
              <div class="form-group">
                <label>Expected Guests</label>
                <input type="number" [(ngModel)]="form.guestCount" placeholder="200">
              </div>
              <div class="form-group">
                <label>Budget (₹)</label>
                <input type="number" [(ngModel)]="form.budget" placeholder="500000">
              </div>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea [(ngModel)]="form.notes" placeholder="Special requirements, themes, etc."></textarea>
            </div>
            <div class="form-actions">
              <button class="btn-primary" (click)="saveEvent()">{{ editing() ? 'Update Event' : 'Create Event 🎊' }}</button>
              <button class="btn-secondary" (click)="cancelForm()">Cancel</button>
            </div>
          </div>
        }

        <!-- EVENTS LIST -->
        @if(loading()) {
          <div class="spinner"></div>
        } @else if(events().length === 0) {
          <div class="empty-events">
            <span>🎊</span>
            <h3>No events yet</h3>
            <p>Start planning your first celebration!</p>
            <button class="btn-primary" (click)="showForm.set(true)">Plan Your First Event</button>
          </div>
        } @else {
          <div class="events-grid">
            @for(event of events(); track event.id) {
              <div class="event-card">
                <div class="event-card-header">
                  <div class="event-type-icon">{{ getIcon(event.type) }}</div>
                  <span class="status-badge" [class]="'status-' + event.status">{{ event.status }}</span>
                </div>
                <h3>{{ event.name }}</h3>
                <div class="event-meta">
                  @if(event.eventDate) { <span>📅 {{ event.eventDate | date:'mediumDate' }}</span> }
                  @if(event.city) { <span>📍 {{ event.city }}, {{ event.stateName }}</span> }
                  @if(event.venue) { <span>🏛️ {{ event.venue }}</span> }
                  @if(event.guestCount) { <span>👥 {{ event.guestCount }} guests</span> }
                  @if(event.budget) { <span>💰 ₹{{ event.budget | number }}</span> }
                </div>
                @if(event.notes) { <p class="event-notes">{{ event.notes }}</p> }
                <div class="event-actions">
                  <select class="status-select" [value]="event.status" (change)="updateStatus(event, $any($event.target).value)">
                    <option value="planning">Planning</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button class="btn-edit" (click)="editEvent(event)">✏️ Edit</button>
                  <button class="btn-delete" (click)="deleteEvent(event.id)">🗑️</button>
                </div>
              </div>
            }
          </div>
        }

        <!-- BOOKING SECTION -->
        <div class="bookings-section">
          <div class="section-header">
            <h2>Vendor Bookings</h2>
            <button class="btn-secondary" style="padding:8px 18px;font-size:0.85rem" (click)="showBookingForm.set(!showBookingForm())">+ Add Booking</button>
          </div>

          @if(showBookingForm()) {
            <div class="event-form-card" style="margin-bottom:24px">
              <h3>Add Vendor Booking</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Service Type</label>
                  <select [(ngModel)]="bookingForm.serviceType">
                    <option>Photographer</option>
                    <option>Caterer</option>
                    <option>Decorator</option>
                    <option>Pundit</option>
                    <option>DJ</option>
                    <option>Venue</option>
                    <option>Makeup Artist</option>
                    <option>Band/Music</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Vendor Name</label>
                  <input type="text" [(ngModel)]="bookingForm.vendorName" placeholder="Vendor/company name">
                </div>
                <div class="form-group">
                  <label>Service Date</label>
                  <input type="date" [(ngModel)]="bookingForm.serviceDate">
                </div>
                <div class="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" [(ngModel)]="bookingForm.amount" placeholder="50000">
                </div>
              </div>
              <div class="form-actions">
                <button class="btn-primary" (click)="saveBooking()">Save Booking</button>
                <button class="btn-secondary" (click)="showBookingForm.set(false)">Cancel</button>
              </div>
            </div>
          }

          @if(bookings().length > 0) {
            <div class="bookings-table">
              <div class="table-header">
                <span>Service</span><span>Vendor</span><span>Date</span><span>Amount</span><span>Status</span><span></span>
              </div>
              @for(b of bookings(); track b.id) {
                <div class="table-row">
                  <span>{{ getServiceIcon(b.serviceType) }} {{ b.serviceType }}</span>
                  <span>{{ b.vendorName }}</span>
                  <span>{{ b.serviceDate | date:'shortDate' }}</span>
                  <span class="amount">₹{{ b.amount | number }}</span>
                  <span class="status-badge" [class]="'status-' + b.status">{{ b.status }}</span>
                  <button class="btn-delete" (click)="deleteBooking(b.id)">🗑️</button>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-header { background: linear-gradient(135deg, var(--deep-red), #8B0020); padding: 36px 0; color: white; }
    .events-header .container { display: flex; justify-content: space-between; align-items: center; }
    .events-header h1 { color: white; font-size: 2rem; }
    .event-form-card { background: white; border-radius: 20px; padding: 32px; margin-bottom: 32px; box-shadow: var(--shadow-warm); }
    .event-form-card h2 { font-size: 1.4rem; color: var(--text-dark); margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } }
    .form-actions { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
    .empty-events { text-align: center; padding: 80px 20px; }
    .empty-events span { font-size: 4rem; display: block; margin-bottom: 16px; }
    .empty-events h3 { font-size: 1.5rem; color: var(--text-dark); margin-bottom: 8px; }
    .empty-events p { color: var(--text-muted); margin-bottom: 24px; }
    .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
    @media(max-width:900px) { .events-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:550px) { .events-grid { grid-template-columns: 1fr; } }
    .event-card { background: white; border-radius: 20px; padding: 24px; box-shadow: var(--shadow-warm); }
    .event-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .event-type-icon { font-size: 2rem; }
    .event-card h3 { font-size: 1.1rem; color: var(--text-dark); margin-bottom: 12px; }
    .event-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
    .event-meta span { font-size: 0.85rem; color: var(--text-muted); }
    .event-notes { font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-bottom: 16px; background: #FFF8F0; padding: 10px; border-radius: 8px; }
    .event-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .status-select { border: 1px solid #E8D8C0; border-radius: 20px; padding: 5px 12px; font-size: 0.8rem; font-family: 'Nunito', sans-serif; outline: none; cursor: pointer; }
    .btn-edit { background: #FFF3E0; border: none; padding: 5px 14px; border-radius: 20px; cursor: pointer; font-size: 0.8rem; font-weight: 600; color: var(--warm-brown); }
    .btn-delete { background: #FFEBEE; border: none; padding: 5px 12px; border-radius: 20px; cursor: pointer; font-size: 0.85rem; }
    .status-badge { padding: 4px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; }
    .status-planning { background: #FFF3E0; color: var(--saffron); }
    .status-confirmed { background: #E8F5E9; color: var(--forest-green); }
    .status-completed { background: #E3F2FD; color: #1565C0; }
    .status-cancelled { background: #FFEBEE; color: var(--deep-red); }
    .bookings-section { background: white; border-radius: 20px; padding: 28px; box-shadow: var(--shadow-warm); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header h2 { font-size: 1.2rem; color: var(--text-dark); }
    .bookings-table { border: 1px solid var(--border-light); border-radius: 12px; overflow: hidden; }
    .table-header { display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr; gap: 12px; padding: 12px 16px; background: #FFF8F0; font-weight: 700; font-size: 0.8rem; color: var(--warm-brown); text-transform: uppercase; }
    .table-row { display: grid; grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr; gap: 12px; padding: 14px 16px; border-top: 1px solid var(--border-light); font-size: 0.88rem; color: var(--text-dark); align-items: center; }
    @media(max-width:700px) { .table-header, .table-row { grid-template-columns: 1fr 1fr; } }
    .amount { font-weight: 700; color: var(--forest-green); }
  `]
})
export class EventsComponent implements OnInit {
  events = signal<any[]>([]);
  bookings = signal<any[]>([]);
  loading = signal(true);
  showForm = signal(false);
  showBookingForm = signal(false);
  editing = signal<any>(null);
  states = STATES;

  form: any = { name: '', type: '', eventDate: '', stateName: '', city: '', venue: '', guestCount: 0, budget: 0, notes: '' };
  bookingForm: any = { serviceType: 'Photographer', vendorName: '', serviceDate: '', amount: 0, status: 'pending' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getEvents().subscribe(e => { this.events.set(e); this.loading.set(false); });
    this.api.getBookings().subscribe(b => this.bookings.set(b));
  }

  saveEvent() {
    if (!this.form.name || !this.form.type) return;
    const obs = this.editing() ? this.api.updateEvent(this.editing().id, this.form) : this.api.createEvent(this.form);
    obs.subscribe(() => { this.cancelForm(); this.loadData(); });
  }

  editEvent(event: any) {
    this.editing.set(event);
    this.form = { ...event };
    this.showForm.set(true);
  }

  cancelForm() {
    this.editing.set(null);
    this.form = { name: '', type: '', eventDate: '', stateName: '', city: '', venue: '', guestCount: 0, budget: 0, notes: '' };
    this.showForm.set(false);
  }

  deleteEvent(id: number) {
    if (confirm('Delete this event?')) {
      this.api.deleteEvent(id).subscribe(() => this.loadData());
    }
  }

  updateStatus(event: any, status: string) {
    this.api.updateEvent(event.id, { status }).subscribe(() => this.loadData());
  }

  saveBooking() {
    this.api.createBooking(this.bookingForm).subscribe(() => {
      this.showBookingForm.set(false);
      this.bookingForm = { serviceType: 'Photographer', vendorName: '', serviceDate: '', amount: 0, status: 'pending' };
      this.loadData();
    });
  }

  deleteBooking(id: number) {
    this.api.deleteBooking(id).subscribe(() => this.loadData());
  }

  getIcon(type: string): string {
    const map: any = { wedding:'💒', engagement:'💍', childbirth:'👶', mundan:'✂️', festival:'🎊' };
    return map[type] || '🎭';
  }

  getServiceIcon(type: string): string {
    const map: any = { Photographer:'📸', Caterer:'🍽️', Decorator:'🌸', Pundit:'🙏', DJ:'🎵', Venue:'🏛️', 'Makeup Artist':'💄', 'Band/Music':'🎶' };
    return map[type] || '📋';
  }
}
