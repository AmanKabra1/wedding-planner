import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home">
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="hero-bg mandala-bg"></div>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-badge">🇮🇳 India's Cultural Events Platform</div>
          <h1 class="hero-title">
            Plan Your Perfect
            <span class="hero-highlight">Indian Celebration</span>
          </h1>
          <p class="hero-subtitle">
            From Rajasthani Baan to Bengali Shubho Drishti — discover state-specific rituals, 
            plan weddings, mundan, naming ceremonies and more with authentic cultural guidance.
          </p>
          <div class="hero-actions">
            <a routerLink="/states" class="btn-primary">Explore Your State 🗺️</a>
            <a routerLink="/rituals" class="btn-secondary">Browse Rituals</a>
          </div>
          <div class="hero-stats">
            <div class="stat"><span class="stat-num">28+</span><span class="stat-label">Indian States</span></div>
            <div class="stat-divider">|</div>
            <div class="stat"><span class="stat-num">100+</span><span class="stat-label">Rituals & Customs</span></div>
            <div class="stat-divider">|</div>
            <div class="stat"><span class="stat-num">10+</span><span class="stat-label">Event Types</span></div>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="floating-element e1">🪷</div>
          <div class="floating-element e2">🌸</div>
          <div class="floating-element e3">🪔</div>
          <div class="floating-element e4">🌺</div>
          <div class="floating-element e5">💐</div>
        </div>
      </section>

      <!-- EVENT TYPES STRIP -->
      <section class="event-types">
        <div class="container">
          <div class="events-scroll">
            @for(evt of eventTypes; track evt.name) {
              <a [routerLink]="['/rituals']" [queryParams]="{type: evt.key}" class="event-pill">
                <span class="event-icon">{{ evt.icon }}</span>
                <span>{{ evt.name }}</span>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- STATES SECTION -->
      <section class="states-section">
        <div class="container">
          <div class="section-title">
            <h2>Discover India's Rich Heritage</h2>
            <div class="divider-ornament"><span>🕉️</span></div>
            <p>Each state has unique traditions, rituals, and ceremonies that make Indian culture truly diverse</p>
          </div>
          <div class="states-grid">
            @for(state of featuredStates; track state.id) {
              <a [routerLink]="['/states', state.id]" class="state-card">
                <div class="state-card-header">
                  <div class="state-emoji">{{ getStateEmoji(state.code) }}</div>
                  <div class="state-badge">{{ state.region }}</div>
                </div>
                <h3>{{ state.name }}</h3>
                <p class="state-lang">{{ state.language }}</p>
                <p class="state-desc">{{ state.culture }}</p>
                <div class="state-arrow">Explore →</div>
              </a>
            }
          </div>
          <div class="text-center" style="margin-top:40px">
            <a routerLink="/states" class="btn-secondary">View All States</a>
          </div>
        </div>
      </section>

      <!-- FEATURES SECTION -->
      <section class="features-section">
        <div class="container">
          <div class="section-title">
            <h2>Everything You Need to Plan</h2>
            <div class="divider-ornament"><span>🌸</span></div>
          </div>
          <div class="features-grid">
            @for(feat of features; track feat.title) {
              <div class="feature-card">
                <div class="feature-icon">{{ feat.icon }}</div>
                <h3>{{ feat.title }}</h3>
                <p>{{ feat.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- RITUAL HIGHLIGHTS -->
      <section class="rituals-highlight">
        <div class="container">
          <div class="section-title">
            <h2>Popular Indian Rituals</h2>
            <div class="divider-ornament"><span>🪔</span></div>
            <p>From Haldi to Saptapadi — understand the meaning behind every ceremony</p>
          </div>
          <div class="rituals-grid">
            @for(ritual of popularRituals; track ritual.name) {
              <div class="ritual-card">
                <div class="ritual-day">Day {{ ritual.day }}</div>
                <h4>{{ ritual.name }}</h4>
                <span class="badge" [class]="'badge-' + ritual.type">{{ ritual.type }}</span>
                <p>{{ ritual.desc }}</p>
              </div>
            }
          </div>
          <div class="text-center" style="margin-top:40px">
            <a routerLink="/rituals" class="btn-primary">View All Rituals 🙏</a>
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <div class="cta-decoration">🪷 🌺 🪷</div>
            <h2>Start Planning Your Celebration</h2>
            <p>Create your personalized event, choose rituals based on your state, and track everything in one place.</p>
            <div class="cta-actions">
              <a routerLink="/register" class="btn-primary">Get Started Free</a>
              <a routerLink="/states" class="btn-gold">Browse Cultures</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home { margin-top: 70px; }

    /* HERO */
    .hero {
      position: relative; min-height: 90vh;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; padding: 60px 20px;
      background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D0 50%, #FFF0E8 100%);
    }
    .hero-bg { position: absolute; inset: 0; z-index: 0; }
    .hero-overlay {
      position: absolute; inset: 0; z-index: 1;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(253,248,240,0.6) 100%);
    }
    .hero-content { position: relative; z-index: 2; text-align: center; max-width: 800px; }
    .hero-badge {
      display: inline-block; background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
      border: 1px solid var(--gold); color: var(--warm-brown);
      padding: 6px 20px; border-radius: 20px; font-size: 0.85rem;
      font-weight: 700; margin-bottom: 24px; letter-spacing: 0.03em;
    }
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      color: var(--text-dark); margin-bottom: 20px; line-height: 1.15;
    }
    .hero-highlight {
      display: block;
      background: linear-gradient(135deg, var(--saffron), var(--deep-red));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-subtitle { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 36px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.7; }
    .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 48px; }
    .hero-stats { display: flex; align-items: center; justify-content: center; gap: 24px; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { display: block; font-family: 'Yeseva One', serif; font-size: 2rem; color: var(--deep-red); }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .stat-divider { color: var(--border-light); font-size: 1.5rem; }

    .hero-decoration { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
    .floating-element {
      position: absolute; font-size: 2rem; opacity: 0.3;
      animation: float 6s ease-in-out infinite;
    }
    .e1 { top: 15%; left: 8%; animation-delay: 0s; }
    .e2 { top: 25%; right: 10%; animation-delay: 1s; }
    .e3 { bottom: 30%; left: 5%; animation-delay: 2s; }
    .e4 { top: 60%; right: 6%; animation-delay: 0.5s; }
    .e5 { bottom: 20%; right: 15%; animation-delay: 1.5s; }
    @keyframes float { 0%,100%{ transform: translateY(0) rotate(0deg); } 50%{ transform: translateY(-20px) rotate(10deg); } }

    /* EVENT TYPES */
    .event-types { background: var(--deep-red); padding: 20px 0; overflow: hidden; }
    .events-scroll { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; padding: 4px; }
    .event-pill {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.15); color: white;
      padding: 10px 20px; border-radius: 30px; text-decoration: none;
      font-weight: 600; font-size: 0.9rem; white-space: nowrap;
      transition: all 0.2s; border: 1px solid rgba(255,255,255,0.2);
    }
    .event-pill:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }

    /* STATES */
    .states-section { padding: 80px 0; background: var(--ivory); }
    .states-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media(max-width:900px) { .states-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:550px) { .states-grid { grid-template-columns: 1fr; } }
    .state-card {
      background: white; border-radius: 20px; padding: 28px;
      text-decoration: none; color: inherit; display: block;
      border: 2px solid transparent; transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .state-card:hover { border-color: var(--saffron); transform: translateY(-6px); box-shadow: 0 12px 40px rgba(255,107,0,0.15); }
    .state-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .state-emoji { font-size: 2.5rem; }
    .state-badge { background: #FFF3E0; color: var(--saffron); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }
    .state-card h3 { font-size: 1.4rem; color: var(--text-dark); margin-bottom: 4px; }
    .state-lang { font-size: 0.85rem; color: var(--gold); font-weight: 600; margin-bottom: 10px; }
    .state-desc { font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }
    .state-arrow { color: var(--saffron); font-weight: 700; font-size: 0.9rem; }

    /* FEATURES */
    .features-section { padding: 80px 0; background: linear-gradient(135deg, #FFF8F0, #FFE8D0); }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    @media(max-width:800px) { .features-grid { grid-template-columns: 1fr; } }
    .feature-card { background: white; border-radius: 20px; padding: 36px 28px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .feature-icon { font-size: 3rem; margin-bottom: 20px; }
    .feature-card h3 { font-size: 1.3rem; color: var(--text-dark); margin-bottom: 12px; }
    .feature-card p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; }

    /* RITUALS */
    .rituals-highlight { padding: 80px 0; background: var(--ivory); }
    .rituals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    @media(max-width:1000px) { .rituals-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:550px) { .rituals-grid { grid-template-columns: 1fr; } }
    .ritual-card {
      background: white; border-radius: 16px; padding: 24px;
      border-left: 4px solid var(--saffron);
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      transition: transform 0.2s;
    }
    .ritual-card:hover { transform: translateY(-4px); }
    .ritual-day { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
    .ritual-card h4 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--text-dark); margin-bottom: 10px; }
    .ritual-card p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-top: 10px; }

    /* CTA */
    .cta-section { padding: 80px 0; background: linear-gradient(135deg, var(--dark-bg), #3D1A00); }
    .cta-card { text-align: center; color: white; max-width: 700px; margin: 0 auto; }
    .cta-decoration { font-size: 2rem; margin-bottom: 24px; letter-spacing: 8px; }
    .cta-card h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); color: var(--gold); margin-bottom: 16px; }
    .cta-card p { color: rgba(255,255,255,0.8); margin-bottom: 36px; font-size: 1.05rem; }
    .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .text-center { text-align: center; }
  `]
})
export class HomeComponent implements OnInit {
  featuredStates: any[] = [];

  eventTypes = [
    { icon: '💒', name: 'Wedding', key: 'wedding' },
    { icon: '💍', name: 'Engagement', key: 'engagement' },
    { icon: '👶', name: 'Childbirth', key: 'childbirth' },
    { icon: '✂️', name: 'Mundan', key: 'mundan' },
    { icon: '🏠', name: 'Griha Pravesh', key: 'griha-pravesh' },
    { icon: '🎊', name: 'Birthday', key: 'festival' },
    { icon: '🧵', name: 'Upanayana', key: 'upanayana' },
  ];

  features = [
    { icon: '🗺️', title: 'State-wise Rituals', desc: 'Explore authentic traditions specific to each Indian state from Rajasthan to Kerala, Punjab to Tamil Nadu.' },
    { icon: '📅', title: 'Event Planner', desc: 'Create and manage your events with timelines, ritual checklists, and budget tracking all in one place.' },
    { icon: '🙏', title: 'Ritual Guide', desc: 'Step-by-step explanations of every ritual with its cultural significance, required items, and procedure.' },
    { icon: '👨‍👩‍👧', title: 'Family Coordination', desc: 'Share your event plan with family members and coordinate responsibilities across rituals.' },
    { icon: '📸', title: 'Vendor Management', desc: 'Track photographers, caterers, decorators and all vendors with booking status and payments.' },
    { icon: '💰', title: 'Budget Tracker', desc: 'Set budgets, track expenses, and get a clear financial overview of your entire celebration.' },
  ];

  popularRituals = [
    { day: 1, name: 'Haldi Ceremony', type: 'wedding', desc: 'Turmeric paste applied for purification and a natural glow before the wedding.' },
    { day: 2, name: 'Mehendi Night', type: 'wedding', desc: 'Intricate henna patterns with the groom\'s name hidden within the design.' },
    { day: 3, name: 'Saptapadi', type: 'wedding', desc: 'Seven sacred vows taken around the holy fire — the core of Hindu marriage.' },
    { day: 1, name: 'Naamkaran', type: 'childbirth', desc: 'Naming ceremony for the newborn on the 11th day after birth.' },
    { day: 1, name: 'Mundan Ceremony', type: 'mundan', desc: 'First head shaving ritual believed to bring good fortune and health.' },
    { day: 2, name: 'Sangeet Night', type: 'wedding', desc: 'Musical evening with folk songs, Bollywood dance, and family performances.' },
    { day: 1, name: 'Godh Bharai', type: 'childbirth', desc: 'Traditional Indian baby shower celebrating the expectant mother.' },
    { day: 1, name: 'Sagai', type: 'engagement', desc: 'Ring exchange and official engagement celebration with both families.' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getStates().subscribe(states => {
      this.featuredStates = states.slice(0, 6);
    });
  }

  getStateEmoji(code: string): string {
    const map: any = {
      'RJ': '🏰', 'MH': '🏙️', 'PB': '🌾', 'TN': '🛕', 'GJ': '🏺',
      'WB': '🐅', 'KL': '🌴', 'UP': '🕌', 'KA': '🐘', 'AP': '🌊',
      'HP': '⛰️', 'GA': '🏖️', 'OD': '🎭', 'AS': '🍃', 'MP': '🌿'
    };
    return map[code] || '🇮🇳';
  }
}
