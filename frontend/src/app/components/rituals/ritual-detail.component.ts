import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ritual-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="margin-top:70px">
      @if(loading()) { <div class="spinner" style="padding:100px"></div> }
      @else if(ritual()) {
        <div class="ritual-hero">
          <div class="container">
            <a routerLink="/rituals" class="back">← Back to Rituals</a>
            <div class="ritual-hero-content">
              <div>
                <span class="badge" [class]="'badge-' + ritual()!.eventType" style="font-size:0.9rem;padding:6px 16px">{{ ritual()!.eventType }}</span>
                <h1>{{ ritual()!.name }}</h1>
                @if(ritual()!.localName) { <p class="local">🔤 Also known as: {{ ritual()!.localName }}</p> }
                <div class="meta-row">
                  @if(ritual()!.timing) { <span>⏰ {{ ritual()!.timing | titlecase }}</span> }
                  <span>📅 Day {{ ritual()!.dayNumber }}</span>
                  @if(ritual()!.isStateSpecific) { <span>📍 State Specific Ritual</span> }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container" style="padding: 60px 20px">
          <div class="detail-grid">
            <div class="main-content">
              <div class="detail-card">
                <h2>📖 About This Ritual</h2>
                <p>{{ ritual()!.description }}</p>
              </div>
              @if(ritual()!.significance) {
                <div class="detail-card significance">
                  <h2>✨ Cultural Significance</h2>
                  <p>{{ ritual()!.significance }}</p>
                </div>
              }
              @if(ritual()!.procedure) {
                <div class="detail-card">
                  <h2>📋 Step-by-Step Procedure</h2>
                  <p>{{ ritual()!.procedure }}</p>
                </div>
              }
            </div>
            <div class="sidebar">
              @if(ritual()!.requiredItems?.length > 0) {
                <div class="sidebar-card">
                  <h3>🧺 Required Items</h3>
                  <ul class="items-list">
                    @for(item of ritual()!.requiredItems; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              }
              <div class="sidebar-card cta-card">
                <h3>Plan This Ritual</h3>
                <p>Add this ritual to your event plan and track all preparations.</p>
                <a routerLink="/events" class="btn-primary" style="display:block;text-align:center;margin-top:16px">Create Event 🎊</a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ritual-hero { background: linear-gradient(135deg, #FF6B00 0%, #B5002B 100%); padding: 60px 20px; color: white; }
    .back { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.9rem; display: block; margin-bottom: 20px; }
    .ritual-hero h1 { font-size: clamp(2rem, 4vw, 3rem); color: white; margin: 12px 0; }
    .local { opacity: 0.9; margin-bottom: 12px; }
    .meta-row { display: flex; gap: 20px; flex-wrap: wrap; }
    .meta-row span { background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; }
    .detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 28px; }
    @media(max-width:768px) { .detail-grid { grid-template-columns: 1fr; } }
    .detail-card { background: white; border-radius: 16px; padding: 28px; margin-bottom: 20px; box-shadow: var(--shadow-warm); }
    .detail-card h2 { font-size: 1.2rem; color: var(--deep-red); margin-bottom: 16px; }
    .detail-card p { color: var(--text-muted); line-height: 1.8; }
    .significance { border-left: 4px solid var(--gold); }
    .sidebar-card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: var(--shadow-warm); }
    .sidebar-card h3 { color: var(--deep-red); margin-bottom: 16px; }
    .items-list { list-style: none; padding: 0; }
    .items-list li { padding: 8px 0; border-bottom: 1px solid var(--border-light); color: var(--text-muted); font-size: 0.9rem; }
    .items-list li:last-child { border-bottom: none; }
    .items-list li::before { content: '✓ '; color: var(--forest-green); font-weight: 700; }
    .cta-card { background: linear-gradient(135deg, #FFF8F0, #FFE8D0); }
    .cta-card p { color: var(--text-muted); font-size: 0.9rem; }
  `]
})
export class RitualDetailComponent implements OnInit {
  ritual = signal<any>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.api.getRitual(id).subscribe(r => {
      this.ritual.set(r);
      this.loading.set(false);
    });
  }
}
