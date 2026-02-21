import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

const CONTACT_PHONE = '6378781547';
const CONTACT_WA    = '916378781547';   // 91 = India country code

@Component({
  selector: 'app-organizers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="margin-top:70px">
      <div class="page-hero">
        <h1>Event Organizers & Pricing 💰</h1>
        <p>Compare verified organizers for weddings, mundan, griha pravesh, upanayana & festivals</p>
      </div>

      <div class="container" style="padding:40px 20px">

        <!-- FILTERS -->
        <div class="filter-bar">
          <div class="filter-group">
            <label>Event Type:</label>
            <div class="filter-pills">
              <button class="filter-pill" [class.active]="selectedType()===''" (click)="filterType('')">All</button>
              @for(t of eventTypes; track t.key) {
                <button class="filter-pill" [class.active]="selectedType()===t.key" (click)="filterType(t.key)">
                  {{ t.icon }} {{ t.name }}
                </button>
              }
            </div>
          </div>
          <div class="filter-group">
            <label>State:</label>
            <select [(ngModel)]="selectedState" (change)="loadOrganizers()">
              <option value="">All States</option>
              @for(s of states; track s) { <option>{{ s }}</option> }
            </select>
          </div>
        </div>

        <!-- PACKAGES -->
        <div class="sec-header"><h2>📦 Packages & Pricing</h2><p>All prices in ₹ — indicative and negotiable</p></div>

        @if(loading()) {
          <div class="spinner-wrap"><div class="spinner"></div></div>
        } @else {
          @for(group of groupedPrices(); track group.eventType) {
            <div class="price-group">
              <div class="grp-head">
                <span>{{ getIcon(group.eventType) }}</span>
                <h3>{{ group.eventType | titlecase }}</h3>
                <span class="pkg-count">{{ group.packages.length }} packages</span>
              </div>
              <div class="pkg-grid">
                @for(pkg of group.packages; track pkg.id) {
                  <div class="pkg-card" [class.featured]="pkg.packageName.includes('Gold')||pkg.packageName.includes('Grand')">
                    @if(pkg.packageName.includes('Gold')||pkg.packageName.includes('Grand')) {
                      <div class="badge-pop">⭐ Most Popular</div>
                    }
                    @if(pkg.packageName.includes('Royal')||pkg.packageName.includes('Premium')) {
                      <div class="badge-pop royal">👑 Premium</div>
                    }
                    <div class="pkg-name">{{ pkg.packageName }}</div>
                    <div class="pkg-price">
                      <span class="from">Starting</span>
                      <span class="amount">₹{{ pkg.basePrice | number }}</span>
                      @if(pkg.maxPrice) { <span class="upto"> – ₹{{ pkg.maxPrice | number }}</span> }
                      <span class="unit"> / {{ pkg.priceUnit }}</span>
                    </div>
                    @if(pkg.guestCountMin) {
                      <div class="guests">👥 {{ pkg.guestCountMin }}–{{ pkg.guestCountMax }} guests</div>
                    }
                    <p class="pkg-desc">{{ pkg.packageDescription }}</p>
                    @if(pkg.inclusions?.length) {
                      <div class="inc"><strong>✅ Included:</strong>
                        <ul>@for(i of pkg.inclusions; track i){ <li>{{ i }}</li> }</ul>
                      </div>
                    }
                    @if(pkg.exclusions?.length) {
                      <div class="exc"><strong>❌ Excluded:</strong>
                        <ul>@for(e of pkg.exclusions; track e){ <li>{{ e }}</li> }</ul>
                      </div>
                    }
                    @if(pkg.isNegotiable) { <div class="neg-tag">🤝 Negotiable</div> }
                    <div class="pkg-actions">
                      <button class="btn-book" (click)="openBooking(pkg)">📋 Book Now</button>
                      <button class="btn-wa" (click)="waEnquire(pkg)">💬 WhatsApp</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        <!-- ORGANIZERS -->
        <div class="sec-header" style="margin-top:60px">
          <h2>🏢 Verified Organizers</h2>
          <div class="org-link-row">
            <a routerLink="/organizer-dashboard" class="btn-become">+ Become an Organizer</a>
          </div>
        </div>
        <div class="org-grid">
          @for(org of organizers(); track org.id) {
            <div class="org-card">
              <div class="org-top">
                <div class="org-av">{{ org.businessName[0] }}</div>
                <div>
                  <h3>{{ org.businessName }}</h3>
                  <div class="org-owner">by {{ org.ownerName }}</div>
                  @if(org.isVerified) { <span class="ver">✓ Verified</span> }
                </div>
              </div>
              <div class="org-meta">
                <span>📍 {{ org.city }}, {{ org.state }}</span>
                <span>⭐ {{ org.rating }}/5</span>
                <span>🎊 {{ org.eventsCompleted }}+</span>
                <span>📅 {{ org.experienceYears }} yrs</span>
              </div>
              <p class="org-desc">{{ org.description }}</p>
              <div class="org-svcs">
                @for(s of org.servicesOffered?.slice(0,4); track s) {
                  <span class="svc-tag">{{ s }}</span>
                }
              </div>
              <div class="org-contacts">
                <a [href]="'tel:' + CONTACT_PHONE" class="cb phone">📞 {{ CONTACT_PHONE }}</a>
                <a [href]="'https://wa.me/' + CONTACT_WA" target="_blank" class="cb wa">💬 WhatsApp</a>
                <a [href]="'mailto:' + org.email" class="cb email">✉️ Email</a>
              </div>
            </div>
          }
        </div>

        <!-- PRICING GUIDE -->
        <div class="guide-section">
          <h2>💡 How Pricing Works</h2>
          <div class="guide-grid">
            <div class="guide-card">
              <div class="gi">📊</div><h4>Price Factors</h4>
              <ul>
                <li>Number of guests</li><li>Venue type</li><li>City / location</li>
                <li>Peak vs off-season</li><li>Services selected</li>
                <li>Days of event</li><li>Decoration style</li><li>Catering complexity</li>
              </ul>
            </div>
            <div class="guide-card">
              <div class="gi">💰</div><h4>Average Ranges</h4>
              <ul>
                <li>Simple Wedding: ₹1.5L–₹5L</li><li>Grand Wedding: ₹20L–₹1Cr+</li>
                <li>Engagement: ₹20K–₹2L</li><li>Mundan: ₹8K–₹80K</li>
                <li>Griha Pravesh: ₹15K–₹1.2L</li><li>Upanayana: ₹25K–₹1.5L</li>
                <li>Festival Event: ₹20K–₹3L</li>
              </ul>
            </div>
            <div class="guide-card">
              <div class="gi">🤝</div><h4>Negotiation Tips</h4>
              <ul>
                <li>Book 6+ months early</li><li>Choose off-season dates</li>
                <li>Bundle multiple services</li><li>Weekday discounts</li>
                <li>Get 3+ quotes</li><li>Ask what can be removed</li>
                <li>Everything in writing</li><li>Pay in installments</li>
              </ul>
            </div>
            <div class="guide-card">
              <div class="gi">⚠️</div><h4>Watch Out For</h4>
              <ul>
                <li>Hidden charges/taxes</li><li>Vague contracts</li>
                <li>Full advance payment</li><li>No cancellation policy</li>
                <li>Unverified food vendors</li><li>Last-minute price hikes</li>
                <li>Substituting items</li><li>No weather backup plan</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- BOOKING MODAL -->
    @if(bookingModal()) {
      <div class="modal-overlay" (click)="closeBooking()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>📋 Book Package</h3>
            <button class="modal-close" (click)="closeBooking()">✕</button>
          </div>
          <div class="modal-body">
            <div class="book-pkg-name">{{ selectedPkg()?.packageName }}</div>
            <div class="book-pkg-price">₹{{ selectedPkg()?.basePrice | number }} onwards</div>
            <div class="form-group">
              <label>Your Name *</label>
              <input type="text" [(ngModel)]="bookForm.name" placeholder="Ravi Sharma">
            </div>
            <div class="form-group">
              <label>Phone / WhatsApp *</label>
              <input type="tel" [(ngModel)]="bookForm.phone" placeholder="6378781547">
            </div>
            <div class="form-group">
              <label>Event Date *</label>
              <input type="date" [(ngModel)]="bookForm.eventDate">
            </div>
            <div class="form-group">
              <label>Number of Guests</label>
              <input type="number" [(ngModel)]="bookForm.guestCount" placeholder="100">
            </div>
            <div class="form-group">
              <label>City / Venue</label>
              <input type="text" [(ngModel)]="bookForm.venue" placeholder="Jaipur, Rajasthan">
            </div>
            <div class="form-group">
              <label>Message (optional)</label>
              <textarea [(ngModel)]="bookForm.message" placeholder="Any special requirements..."></textarea>
            </div>

            @if(bookingSuccess()) {
              <div class="success-msg">
                ✅ Enquiry sent! The organizer will contact you on <strong>{{ bookForm.phone }}</strong> within 24 hours.
              </div>
            } @else {
              <div class="modal-actions">
                <button class="btn-primary" (click)="submitBooking()">Send Enquiry 🙏</button>
                <button class="btn-wa-book" (click)="waBook()">💬 WhatsApp Instead</button>
              </div>
            }

            <div class="payment-note">
              <h4>💳 Payment Process</h4>
              <p>After confirmation, you can pay via:</p>
              <div class="pay-methods">
                <span>📱 UPI</span>
                <span>🏦 Bank Transfer</span>
                <span>💵 Cash</span>
                <span>📲 PhonePe / GPay</span>
              </div>
              <p class="pay-info">Advance: 20–30% to confirm booking. Balance on event day.</p>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-hero { background: linear-gradient(135deg, #1B5E20, #2E7D32); color: white; padding: 60px 20px; text-align: center; }
    .page-hero h1 { color: white; font-size: clamp(2rem,4vw,3rem); margin-bottom: 12px; }
    .page-hero p { opacity: 0.9; font-size: 1.05rem; }
    .filter-bar { background: white; border-radius: 16px; padding: 24px; margin-bottom: 32px; box-shadow: var(--shadow-warm); }
    .filter-group { margin-bottom: 14px; }
    .filter-group:last-child { margin-bottom: 0; }
    .filter-group label { display: block; font-weight: 700; color: var(--warm-brown); margin-bottom: 10px; font-size: 0.88rem; }
    .filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .filter-pill { padding: 7px 16px; border-radius: 20px; border: 2px solid var(--border-light); background: white; cursor: pointer; font-family: 'Nunito',sans-serif; font-weight: 600; font-size: 0.82rem; transition: all 0.2s; }
    .filter-pill.active, .filter-pill:hover { background: #1B5E20; color: white; border-color: #1B5E20; }
    select { padding: 8px 14px; border: 2px solid var(--border-light); border-radius: 10px; font-family: 'Nunito',sans-serif; font-size: 0.9rem; outline: none; }
    .sec-header { margin-bottom: 24px; }
    .sec-header h2 { font-size: 1.8rem; color: var(--text-dark); }
    .sec-header p { color: var(--text-muted); }
    .org-link-row { margin-top: 8px; }
    .btn-become { display: inline-block; background: linear-gradient(135deg,var(--saffron),var(--deep-red)); color: white; padding: 10px 22px; border-radius: 20px; text-decoration: none; font-weight: 700; font-size: 0.88rem; }
    .spinner-wrap { display: flex; justify-content: center; padding: 60px; }
    .spinner { width: 40px; height: 40px; border: 4px solid var(--border-light); border-top-color: var(--saffron); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .price-group { margin-bottom: 48px; }
    .grp-head { display: flex; align-items: center; gap: 10px; padding-bottom: 14px; border-bottom: 2px solid var(--border-light); margin-bottom: 20px; flex-wrap: wrap; }
    .grp-head span:first-child { font-size: 2rem; }
    .grp-head h3 { font-size: 1.4rem; color: var(--deep-red); flex: 1; }
    .pkg-count { background: #FFF3E0; color: var(--saffron); padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; font-weight: 700; }
    .pkg-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    @media(max-width:1000px) { .pkg-grid { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:600px) { .pkg-grid { grid-template-columns: 1fr; } }
    .pkg-card { background: white; border-radius: 20px; padding: 22px; box-shadow: 0 4px 18px rgba(0,0,0,0.06); border: 2px solid transparent; position: relative; transition: all 0.3s; }
    .pkg-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-gold); }
    .pkg-card.featured { border-color: var(--gold); }
    .badge-pop { position: absolute; top: -12px; left: 18px; background: linear-gradient(135deg,var(--gold),var(--saffron)); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
    .badge-pop.royal { background: linear-gradient(135deg,#4A148C,#7B1FA2); }
    .pkg-name { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin: 8px 0 10px; }
    .pkg-price { margin-bottom: 8px; }
    .from { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; display: block; }
    .amount { font-family: 'Yeseva One',serif; font-size: 1.7rem; color: #1B5E20; }
    .upto, .unit { color: var(--text-muted); font-size: 0.85rem; }
    .guests { background: #E8F5E9; color: #1B5E20; padding: 4px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; display: inline-block; margin-bottom: 10px; }
    .pkg-desc { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5; }
    .inc, .exc { margin-bottom: 10px; font-size: 0.82rem; color: var(--text-muted); }
    .inc ul, .exc ul { list-style: none; padding: 0; margin: 4px 0 0; }
    .inc ul li::before { content: '✓ '; color: #1B5E20; font-weight: 700; }
    .exc ul li::before { content: '✗ '; color: var(--deep-red); }
    .neg-tag { display: inline-block; background: #E8F5E9; color: #1B5E20; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 8px; margin-bottom: 12px; }
    .pkg-actions { display: flex; gap: 8px; margin-top: 8px; }
    .btn-book { flex: 1; background: linear-gradient(135deg,#1B5E20,#2E7D32); color: white; border: none; padding: 10px; border-radius: 20px; font-family: 'Nunito',sans-serif; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
    .btn-wa { flex: 1; background: #E8F5E9; color: #1B5E20; border: none; padding: 10px; border-radius: 20px; font-family: 'Nunito',sans-serif; font-weight: 700; cursor: pointer; font-size: 0.85rem; }
    .org-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; margin-bottom: 48px; }
    @media(max-width:900px) { .org-grid { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:550px) { .org-grid { grid-template-columns: 1fr; } }
    .org-card { background: white; border-radius: 20px; padding: 22px; box-shadow: var(--shadow-warm); border: 2px solid transparent; transition: all 0.3s; }
    .org-card:hover { border-color: var(--gold); transform: translateY(-4px); }
    .org-top { display: flex; gap: 12px; margin-bottom: 12px; }
    .org-av { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg,var(--saffron),var(--deep-red)); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
    .org-top h3 { font-size: 1rem; color: var(--text-dark); margin-bottom: 2px; }
    .org-owner { font-size: 0.8rem; color: var(--text-muted); }
    .ver { background: #E8F5E9; color: #1B5E20; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 8px; }
    .org-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    .org-meta span { font-size: 0.78rem; color: var(--text-muted); }
    .org-desc { font-size: 0.84rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px; }
    .org-svcs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .svc-tag { background: #FFF3E0; color: var(--saffron); padding: 3px 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }
    .org-contacts { display: flex; gap: 6px; flex-wrap: wrap; }
    .cb { padding: 6px 12px; border-radius: 16px; text-decoration: none; font-size: 0.78rem; font-weight: 700; transition: all 0.2s; }
    .cb.phone { background: #E3F2FD; color: #1565C0; }
    .cb.wa { background: #E8F5E9; color: #1B5E20; }
    .cb.email { background: #FFF3E0; color: var(--saffron); }
    .cb:hover { transform: translateY(-2px); }
    .guide-section { background: linear-gradient(135deg,#FFF8F0,#FFE8D0); border-radius: 20px; padding: 36px; }
    .guide-section h2 { font-size: 1.8rem; color: var(--text-dark); margin-bottom: 24px; text-align: center; }
    .guide-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
    @media(max-width:900px) { .guide-grid { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:500px) { .guide-grid { grid-template-columns: 1fr; } }
    .guide-card { background: white; border-radius: 14px; padding: 18px; }
    .gi { font-size: 1.8rem; margin-bottom: 10px; }
    .guide-card h4 { font-size: 0.95rem; color: var(--deep-red); margin-bottom: 10px; }
    .guide-card ul { list-style: none; padding: 0; }
    .guide-card ul li { font-size: 0.8rem; color: var(--text-muted); padding: 4px 0; border-bottom: 1px solid var(--border-light); }
    .guide-card ul li:last-child { border-bottom: none; }
    .guide-card ul li::before { content: '• '; color: var(--saffron); }
    /* MODAL */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-box { background: white; border-radius: 20px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 16px; border-bottom: 2px solid var(--border-light); }
    .modal-header h3 { font-size: 1.2rem; color: var(--text-dark); }
    .modal-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-muted); }
    .modal-body { padding: 20px 24px 24px; }
    .book-pkg-name { font-weight: 700; color: var(--text-dark); font-size: 1rem; margin-bottom: 4px; }
    .book-pkg-price { font-family: 'Yeseva One',serif; color: #1B5E20; font-size: 1.4rem; margin-bottom: 18px; }
    .modal-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
    .btn-primary { flex: 1; background: linear-gradient(135deg,var(--saffron),var(--deep-red)); color: white; border: none; padding: 12px 20px; border-radius: 30px; font-family: 'Nunito',sans-serif; font-weight: 700; cursor: pointer; }
    .btn-wa-book { flex: 1; background: #E8F5E9; color: #1B5E20; border: 2px solid #1B5E20; padding: 10px 20px; border-radius: 30px; font-family: 'Nunito',sans-serif; font-weight: 700; cursor: pointer; }
    .success-msg { background: #E8F5E9; color: #1B5E20; padding: 16px; border-radius: 12px; margin-top: 12px; font-weight: 600; line-height: 1.5; }
    .payment-note { margin-top: 20px; background: #FFF3E0; border-radius: 12px; padding: 16px; }
    .payment-note h4 { color: var(--warm-brown); margin-bottom: 6px; font-size: 0.95rem; }
    .payment-note p { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 10px; }
    .pay-methods { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
    .pay-methods span { background: white; border: 1px solid var(--border-light); padding: 5px 12px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; }
    .pay-info { font-size: 0.8rem; color: var(--text-muted); }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 5px; color: var(--warm-brown); font-size: 0.85rem; }
    .form-group input, .form-group textarea { width: 100%; padding: 10px 13px; border: 2px solid #E8D8C0; border-radius: 10px; font-family: 'Nunito',sans-serif; font-size: 0.9rem; outline: none; }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--saffron); }
    .form-group textarea { min-height: 70px; resize: vertical; }
  `]
})
export class OrganizersComponent implements OnInit {
  organizers   = signal<any[]>([]);
  allPrices    = signal<any[]>([]);
  groupedPrices = signal<{eventType:string,packages:any[]}[]>([]);
  loading      = signal(true);
  selectedType = signal('');
  selectedState = '';
  bookingModal  = signal(false);
  selectedPkg  = signal<any>(null);
  bookingSuccess = signal(false);

  CONTACT_PHONE = CONTACT_PHONE;
  CONTACT_WA    = CONTACT_WA;

  bookForm = { name:'', phone:'', eventDate:'', guestCount: 100, venue:'', message:'' };

  states = ['Rajasthan','Maharashtra','Punjab','Tamil Nadu','Gujarat','West Bengal','Kerala','Uttar Pradesh','Karnataka'];
  eventTypes = [
    {key:'wedding',     icon:'💒', name:'Wedding'},
    {key:'engagement',  icon:'💍', name:'Engagement'},
    {key:'mundan',      icon:'✂️',  name:'Mundan'},
    {key:'griha-pravesh',icon:'🏠',name:'Griha Pravesh'},
    {key:'upanayana',   icon:'🧵', name:'Upanayana'},
    {key:'festival',    icon:'🎊', name:'Festival'},
  ];

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading.set(true);
    this.loadOrganizers();
    this.api.getOrganizerPrices(this.selectedType() || undefined).subscribe(prices => {
      this.allPrices.set(prices);
      this.groupPrices(prices);
      this.loading.set(false);
    });
  }

  loadOrganizers() {
    this.api.getOrganizers(this.selectedState || undefined).subscribe(o => this.organizers.set(o));
  }

  filterType(type: string) {
    this.selectedType.set(type);
    this.api.getOrganizerPrices(type || undefined).subscribe(prices => {
      this.allPrices.set(prices);
      this.groupPrices(prices);
    });
  }

  groupPrices(prices: any[]) {
    const types = [...new Set(prices.map(p => p.eventType))];
    this.groupedPrices.set(types.map(t => ({ eventType: t, packages: prices.filter(p => p.eventType === t) })));
  }

  getIcon(type: string) {
    const map: any = {wedding:'💒',engagement:'💍',mundan:'✂️','griha-pravesh':'🏠',upanayana:'🧵',festival:'🎊'};
    return map[type] || '🎭';
  }

  openBooking(pkg: any) {
    this.selectedPkg.set(pkg);
    this.bookingSuccess.set(false);
    this.bookForm = { name:'', phone:'', eventDate:'', guestCount: 100, venue:'', message:'' };
    this.bookingModal.set(true);
  }
  closeBooking() { this.bookingModal.set(false); }

  submitBooking() {
    if (!this.bookForm.name || !this.bookForm.phone || !this.bookForm.eventDate) {
      alert('Please fill Name, Phone and Event Date');
      return;
    }
    // In a real app: call API to save booking
    // For now: show success + open WhatsApp
    this.bookingSuccess.set(true);
    setTimeout(() => this.waBook(), 500);
  }

  waEnquire(pkg: any) {
    const msg = `Hi! I'm interested in the *${pkg.packageName}* package for *${pkg.eventType}*.\nBudget: ₹${Number(pkg.basePrice).toLocaleString('en-IN')} onwards.\nPlease share more details.`;
    window.open(`https://wa.me/${CONTACT_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  waBook() {
    const pkg = this.selectedPkg();
    const msg = `Hi! I want to book the *${pkg?.packageName}* package.\n\n👤 Name: ${this.bookForm.name}\n📞 Phone: ${this.bookForm.phone}\n📅 Date: ${this.bookForm.eventDate}\n👥 Guests: ${this.bookForm.guestCount}\n📍 Venue: ${this.bookForm.venue}\n💬 Note: ${this.bookForm.message || 'N/A'}`;
    window.open(`https://wa.me/${CONTACT_WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
