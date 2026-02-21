import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rituals',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div style="margin-top:70px">
      <div class="page-hero" style="background: linear-gradient(135deg, #FF6B00, #B5002B)">
        <div class="container">
          <h1>Indian Ritual Guide 🙏</h1>
          <p>Complete guide to authentic rituals and ceremonies across all Indian states</p>
        </div>
      </div>

      <div class="container" style="padding: 40px 20px">

        <!-- FILTER BAR -->
        <div class="filter-bar">
          <label class="filter-label">Filter by Event Type:</label>
          <div class="filter-pills">
            <button class="filter-pill"
              [class.active]="selectedType() === ''"
              (click)="filterByType('')">
              🎭 All
            </button>
            @for(type of eventTypes; track type.key) {
              <button class="filter-pill"
                [class.active]="selectedType() === type.key"
                (click)="filterByType(type.key)">
                {{ type.icon }} {{ type.label }}
              </button>
            }
          </div>
        </div>

        @if(loading()) {
          <div class="spinner"></div>
        } @else if(groupedRituals().length === 0) {
          <div class="empty-state">
            <span style="font-size:3rem">🙏</span>
            <p>No rituals found. Try a different filter.</p>
          </div>
        } @else {
          @for(group of groupedRituals(); track group.day) {
            <div class="day-group">
              <div class="day-label">
                <span>📅</span> Day {{ group.day }} Ceremonies
              </div>
              <div class="rituals-grid">
                @for(ritual of group.rituals; track ritual.id) {
                  <a [routerLink]="['/rituals', ritual.id]" class="ritual-card-full">
                    <div class="ritual-top">
                      <div>
                        <h3>{{ ritual.name }}</h3>
                        @if(ritual.localName) {
                          <p class="local-name">{{ ritual.localName }}</p>
                        }
                      </div>
                      <span class="badge" [class]="'badge-' + ritual.eventType">
                        {{ getEventLabel(ritual.eventType) }}
                      </span>
                    </div>
                    <p>{{ ritual.description?.substring(0, 150) }}...</p>
                    @if(ritual.timing) {
                      <div class="ritual-meta">⏰ {{ ritual.timing | titlecase }}</div>
                    }
                    @if(ritual.isStateSpecific) {
                      <div class="state-specific-tag">📍 State Specific</div>
                    }
                  </a>
                }
              </div>
            </div>
          }
        }

      </div>
    </div>
  `,
  styles: [`
    .page-hero { padding: 60px 20px; color: white; text-align: center; }
    .page-hero h1 { color: white; font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 12px; }
    .page-hero p { opacity: 0.9; font-size: 1.05rem; }

    .filter-bar {
      background: white; border-radius: 16px; padding: 24px;
      margin-bottom: 36px; box-shadow: var(--shadow-warm);
    }
    .filter-label {
      display: block; font-weight: 700; color: var(--warm-brown);
      margin-bottom: 14px; font-size: 0.95rem;
    }
    .filter-pills { display: flex; gap: 10px; flex-wrap: wrap; }
    .filter-pill {
      padding: 9px 18px; border-radius: 25px;
      border: 2px solid var(--border-light);
      background: white; cursor: pointer;
      font-family: 'Nunito', sans-serif;
      font-weight: 600; font-size: 0.88rem;
      transition: all 0.2s; color: var(--text-dark);
    }
    .filter-pill:hover { border-color: var(--saffron); color: var(--saffron); }
    .filter-pill.active {
      background: linear-gradient(135deg, var(--saffron), var(--deep-red));
      color: white; border-color: transparent;
      box-shadow: 0 4px 12px rgba(255,107,0,0.35);
    }

    .day-group { margin-bottom: 48px; }
    .day-label {
      display: flex; align-items: center; gap: 10px;
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem; color: var(--deep-red);
      margin-bottom: 20px; padding-bottom: 12px;
      border-bottom: 2px solid var(--border-light);
    }
    .rituals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media(max-width:900px) { .rituals-grid { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:550px) { .rituals-grid { grid-template-columns: 1fr; } }

    .ritual-card-full {
      display: block; text-decoration: none; color: inherit;
      background: white; border-radius: 16px; padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      border: 2px solid transparent; transition: all 0.3s;
    }
    .ritual-card-full:hover {
      border-color: var(--saffron);
      transform: translateY(-4px);
      box-shadow: var(--shadow-gold);
    }
    .ritual-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 12px; gap: 12px;
    }
    .ritual-top h3 { font-size: 1.05rem; color: var(--text-dark); }
    .local-name { font-style: italic; color: var(--gold); font-size: 0.8rem; margin-top: 3px; }
    .ritual-card-full p { font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px; }
    .ritual-meta { font-size: 0.8rem; color: var(--text-muted); }
    .state-specific-tag {
      display: inline-block; background: #FFF3E0;
      color: var(--saffron); font-size: 0.75rem;
      font-weight: 700; padding: 3px 10px;
      border-radius: 10px; margin-top: 8px;
    }

    .badge {
      display: inline-block; padding: 4px 10px;
      border-radius: 12px; font-size: 0.72rem;
      font-weight: 700; text-transform: capitalize;
      white-space: nowrap; flex-shrink: 0;
    }
    .badge-wedding { background: #FFE0E8; color: var(--deep-red); }
    .badge-engagement { background: #FFF3E0; color: var(--saffron); }
    .badge-childbirth { background: #E8F5E9; color: #1B5E20; }
    .badge-mundan { background: #E3F2FD; color: #1565C0; }
    .badge-festival { background: #FFF8E1; color: #F57F17; }
    .badge-griha-pravesh { background: #F3E5F5; color: #6A1B9A; }
    .badge-upanayana { background: #E0F2F1; color: #004D40; }

    .empty-state { text-align: center; padding: 60px; color: var(--text-muted); }
    .spinner { display: flex; justify-content: center; padding: 60px; }
    .spinner::after {
      content: ''; width: 40px; height: 40px;
      border: 4px solid var(--border-light);
      border-top-color: var(--saffron);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class RitualsComponent implements OnInit {
  allRituals: any[] = [];
  groupedRituals = signal<{day: number, rituals: any[]}[]>([]);
  loading = signal(true);
  selectedType = signal('');

  // All event types with icons and labels
  eventTypes = [
    { key: 'wedding',      icon: '💒', label: 'Wedding' },
    { key: 'engagement',   icon: '💍', label: 'Engagement' },
    { key: 'childbirth',   icon: '👶', label: 'Childbirth' },
    { key: 'mundan',       icon: '✂️', label: 'Mundan' },
    { key: 'griha-pravesh',icon: '🏠', label: 'Griha Pravesh' },
    { key: 'upanayana',    icon: '🧵', label: 'Upanayana' },
    { key: 'festival',     icon: '🎊', label: 'Festival' },
  ];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Load all rituals first
    this.api.getRituals().subscribe(rituals => {
      this.allRituals = rituals;
      // Check if URL has ?type= param
      const type = this.route.snapshot.queryParams['type'];
      if (type) {
        this.selectedType.set(type);
        this.applyFilter(type);
      } else {
        this.applyFilter('');
      }
      this.loading.set(false);
    });
  }

  filterByType(type: string) {
    this.selectedType.set(type);
    this.applyFilter(type);
  }

  applyFilter(type: string) {
    const filtered = type
      ? this.allRituals.filter(r => r.eventType === type)
      : this.allRituals;

    const days = [...new Set(filtered.map(r => r.dayNumber))].sort((a, b) => a - b);
    this.groupedRituals.set(
      days.map(day => ({
        day,
        rituals: filtered.filter(r => r.dayNumber === day)
      }))
    );
  }

  getEventLabel(type: string): string {
    const found = this.eventTypes.find(e => e.key === type);
    return found ? found.label : type;
  }
}
