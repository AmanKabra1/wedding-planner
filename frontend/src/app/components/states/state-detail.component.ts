import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-state-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="margin-top:70px">
      @if(loading()) {
        <div class="spinner" style="padding:100px"></div>
      } @else if(state()) {
        <div class="state-hero" [style.background]="getGradient(state()!.code)">
          <div class="container">
            <div class="state-hero-content">
              <span class="state-emoji">{{ getEmoji(state()!.code) }}</span>
              <div>
                <div class="back-link"><a routerLink="/states">← All States</a></div>
                <h1>{{ state()!.name }}</h1>
                <p class="state-lang">{{ state()!.language }} • {{ state()!.region }} India</p>
              </div>
            </div>
          </div>
        </div>

        <div class="container" style="padding: 60px 20px">
          <div class="state-detail-grid">
            <div class="state-info">
              <div class="info-card">
                <h3>🎭 Cultural Heritage</h3>
                <p>{{ state()!.culture }}</p>
              </div>
              <div class="info-card">
                <h3>📖 About Traditions</h3>
                <p>{{ state()!.description }}</p>
              </div>
            </div>
            <div class="state-rituals">
              <h3>🙏 State Rituals & Ceremonies</h3>
              @if(rituals().length > 0) {
                @for(ritual of rituals(); track ritual.id) {
                  <div class="ritual-item">
                    <div class="ritual-item-header">
                      <h4>{{ ritual.name }}</h4>
                      <span class="badge" [class]="'badge-' + ritual.eventType">{{ ritual.eventType }}</span>
                    </div>
                    @if(ritual.localName) { <p class="local-name">🔤 {{ ritual.localName }}</p> }
                    <p>{{ ritual.description }}</p>
                    @if(ritual.significance) {
                      <div class="significance">✨ {{ ritual.significance }}</div>
                    }
                  </div>
                }
              } @else {
                <div class="no-specific">
                  <p>This state follows common Hindu rituals. <a routerLink="/rituals">View all rituals →</a></p>
                </div>
              }
            </div>
          </div>
          <div style="text-align:center;margin-top:40px">
            <a routerLink="/events" class="btn-primary">Plan an Event in {{ state()!.name }} 🎊</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .state-hero { padding: 60px 20px; color: white; }
    .state-hero-content { display: flex; gap: 24px; align-items: center; }
    .state-emoji { font-size: 5rem; }
    .state-hero h1 { font-size: clamp(2rem, 4vw, 3.5rem); color: white; margin-bottom: 8px; }
    .state-lang { opacity: 0.9; font-size: 1.1rem; }
    .back-link a { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.9rem; }
    .state-detail-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 32px; }
    @media(max-width:768px) { .state-detail-grid { grid-template-columns: 1fr; } }
    .info-card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: var(--shadow-warm); }
    .info-card h3 { font-size: 1.1rem; color: var(--deep-red); margin-bottom: 12px; }
    .info-card p { color: var(--text-muted); line-height: 1.7; }
    .state-rituals h3 { font-size: 1.4rem; color: var(--text-dark); margin-bottom: 20px; }
    .ritual-item { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; border-left: 4px solid var(--saffron); box-shadow: var(--shadow-warm); }
    .ritual-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 12px; flex-wrap: wrap; }
    .ritual-item h4 { font-size: 1.1rem; color: var(--text-dark); }
    .local-name { color: var(--gold); font-style: italic; font-size: 0.85rem; margin-bottom: 8px; }
    .significance { background: #FFF8E1; color: var(--warm-brown); padding: 10px 14px; border-radius: 8px; font-size: 0.88rem; margin-top: 10px; }
    .no-specific { background: #FFF3E0; border-radius: 12px; padding: 24px; text-align: center; }
    .no-specific a { color: var(--saffron); font-weight: 700; }
  `]
})
export class StateDetailComponent implements OnInit {
  state = signal<any>(null);
  rituals = signal<any[]>([]);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.api.getState(id).subscribe(state => {
      this.state.set(state);
      this.rituals.set(state.rituals || []);
      this.loading.set(false);
    });
  }

  getEmoji(code: string): string {
    const map: any = { 'RJ':'🏰','MH':'🏙️','PB':'🌾','TN':'🛕','GJ':'🏺','WB':'🐅','KL':'🌴','UP':'🕌','KA':'🐘','AP':'🌊','HP':'⛰️','GA':'🏖️','OD':'🎭','AS':'🍃','MP':'🌿' };
    return map[code] || '🇮🇳';
  }

  getGradient(code: string): string {
    const map: any = { 'RJ':'linear-gradient(135deg,#B5002B,#8B0020)','MH':'linear-gradient(135deg,#1565C0,#0D47A1)','PB':'linear-gradient(135deg,#FF6B00,#E65100)','TN':'linear-gradient(135deg,#1B5E20,#2E7D32)','GJ':'linear-gradient(135deg,#F57F17,#E65100)','WB':'linear-gradient(135deg,#4A148C,#6A1B9A)','KL':'linear-gradient(135deg,#004D40,#00695C)','UP':'linear-gradient(135deg,#BF360C,#D84315)' };
    return map[code] || 'linear-gradient(135deg,var(--deep-red),#8B0020)';
  }
}
