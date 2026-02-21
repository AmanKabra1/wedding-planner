import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-states',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="states-page" style="margin-top:70px">
      <div class="page-hero">
        <div class="container">
          <h1>India's Cultural Tapestry</h1>
          <p>Explore unique wedding customs, rituals and traditions from across 28 Indian states</p>
          <input type="search" placeholder="🔍 Search by state name or language..." class="search-box" [(ngModel)]="searchQuery" (input)="filterStates()">
        </div>
      </div>

      <div class="container" style="padding: 60px 20px">
        @if(loading()) {
          <div class="spinner"></div>
        } @else {
          <div class="region-filter">
            @for(region of regions; track region) {
              <button class="region-btn" [class.active]="selectedRegion() === region" (click)="filterByRegion(region)">{{ region }}</button>
            }
          </div>

          <div class="states-grid">
            @for(state of filteredStates(); track state.id) {
              <a [routerLink]="['/states', state.id]" class="state-card-full">
                <div class="state-header">
                  <div class="state-icon">{{ getEmoji(state.code) }}</div>
                  <div>
                    <h3>{{ state.name }}</h3>
                    <span class="region-tag">{{ state.region }}</span>
                  </div>
                </div>
                <div class="state-language">
                  <span class="lang-label">Languages:</span> {{ state.language }}
                </div>
                <p class="state-culture">{{ state.culture }}</p>
                <p class="state-description">{{ state.description?.substring(0, 120) }}...</p>
                <div class="state-footer">
                  <span class="explore-link">Explore Rituals & Culture →</span>
                </div>
              </a>
            }
          </div>

          @if(filteredStates().length === 0) {
            <div class="no-results">
              <span style="font-size:3rem">🔍</span>
              <p>No states found matching "{{ searchQuery }}"</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--deep-red), #8B0020);
      color: white; padding: 60px 20px; text-align: center;
    }
    .page-hero h1 { font-size: clamp(2rem, 4vw, 3rem); color: white; margin-bottom: 12px; }
    .page-hero p { opacity: 0.9; font-size: 1.1rem; margin-bottom: 28px; }
    .search-box {
      width: 100%; max-width: 500px; padding: 14px 20px;
      border-radius: 30px; border: none; font-size: 1rem;
      font-family: 'Nunito', sans-serif; outline: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .region-filter { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
    .region-btn {
      padding: 8px 18px; border-radius: 20px; border: 2px solid var(--border-light);
      background: white; cursor: pointer; font-family: 'Nunito', sans-serif;
      font-weight: 600; font-size: 0.85rem; transition: all 0.2s;
    }
    .region-btn.active, .region-btn:hover { background: var(--saffron); color: white; border-color: var(--saffron); }
    .states-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    @media(max-width:900px) { .states-grid { grid-template-columns: repeat(2,1fr); } }
    @media(max-width:550px) { .states-grid { grid-template-columns: 1fr; } }
    .state-card-full {
      display: block; text-decoration: none; color: inherit;
      background: white; border-radius: 20px; padding: 28px;
      border: 2px solid transparent; transition: all 0.3s;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .state-card-full:hover { border-color: var(--saffron); transform: translateY(-4px); box-shadow: var(--shadow-gold); }
    .state-header { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; }
    .state-icon { font-size: 2.5rem; }
    .state-header h3 { font-size: 1.3rem; color: var(--text-dark); margin-bottom: 4px; }
    .region-tag { background: #FFF3E0; color: var(--saffron); padding: 2px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; }
    .state-language { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; }
    .lang-label { font-weight: 700; color: var(--warm-brown); }
    .state-culture { font-weight: 600; color: var(--warm-brown); margin-bottom: 8px; font-size: 0.95rem; }
    .state-description { font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }
    .state-footer { border-top: 1px solid var(--border-light); padding-top: 14px; }
    .explore-link { color: var(--saffron); font-weight: 700; font-size: 0.9rem; }
    .no-results { text-align: center; padding: 60px; color: var(--text-muted); }
  `]
})
export class StatesComponent implements OnInit {
  allStates: any[] = [];
  filteredStates = signal<any[]>([]);
  loading = signal(true);
  searchQuery = '';
  selectedRegion = signal('All');
  regions = ['All', 'North', 'South', 'East', 'West', 'Central', 'North-East', 'North-West'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getStates().subscribe(states => {
      this.allStates = states;
      this.filteredStates.set(states);
      this.loading.set(false);
    });
  }

  filterStates() {
    const q = this.searchQuery.toLowerCase();
    const region = this.selectedRegion();
    this.filteredStates.set(this.allStates.filter(s =>
      (s.name.toLowerCase().includes(q) || s.language.toLowerCase().includes(q)) &&
      (region === 'All' || s.region?.includes(region))
    ));
  }

  filterByRegion(region: string) {
    this.selectedRegion.set(region);
    this.filterStates();
  }

  getEmoji(code: string): string {
    const map: any = {
      'RJ':'🏰','MH':'🏙️','PB':'🌾','TN':'🛕','GJ':'🏺',
      'WB':'🐅','KL':'🌴','UP':'🕌','KA':'🐘','AP':'🌊',
      'HP':'⛰️','GA':'🏖️','OD':'🎭','AS':'🍃','MP':'🌿'
    };
    return map[code] || '🇮🇳';
  }
}
