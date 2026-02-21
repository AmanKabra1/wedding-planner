import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-symbol">🪷</span>
          <div class="logo-text">
            <span class="logo-main">Shaadi</span>
            <span class="logo-sub">Vidhaan</span>
          </div>
        </a>

        <button class="hamburger" (click)="toggleMenu()" [class.active]="menuOpen()">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav-links" [class.open]="menuOpen()">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMenu()">Home</a></li>
          <li><a routerLink="/states" routerLinkActive="active" (click)="closeMenu()">States & Culture</a></li>
          <li><a routerLink="/rituals" routerLinkActive="active" (click)="closeMenu()">Rituals</a></li>
          <li><a routerLink="/organizers" routerLinkActive="active" (click)="closeMenu()">Organizers & Pricing</a></li>
          @if(auth.isLoggedIn) {
            <li><a routerLink="/events" routerLinkActive="active" (click)="closeMenu()">My Events</a></li>
            <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">Dashboard</a></li>
            <li class="user-menu">
              <span class="user-name">🙏 {{ auth.currentUser?.name?.split(' ')![0] }}</span>
              <button class="btn-logout" (click)="logout()">Logout</button>
            </li>
          } @else {
            <li><a routerLink="/login" class="btn-nav-login" (click)="closeMenu()">Login</a></li>
            <li><a routerLink="/register" class="btn-nav-register" (click)="closeMenu()">Get Started</a></li>
          }
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(253, 248, 240, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease;
      height: 70px;
    }
    .navbar.scrolled {
      border-bottom-color: var(--border-light);
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .nav-container {
      max-width: 1200px; margin: 0 auto;
      padding: 0 20px; height: 100%;
      display: flex; align-items: center; justify-content: space-between;
    }
    .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-symbol { font-size: 1.8rem; }
    .logo-text { display: flex; flex-direction: column; line-height: 1.1; }
    .logo-main { font-family: 'Yeseva One', serif; font-size: 1.4rem; color: var(--deep-red); }
    .logo-sub { font-size: 0.65rem; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; }
    .nav-links {
      display: flex; align-items: center; gap: 4px;
      list-style: none; margin: 0; padding: 0;
    }
    .nav-links li a {
      text-decoration: none; color: var(--text-dark);
      font-weight: 600; font-size: 0.85rem; padding: 8px 10px;
      border-radius: 8px; transition: all 0.2s;
    }
    .nav-links li a:hover, .nav-links li a.active { color: var(--saffron); }
    .btn-nav-login {
      border: 2px solid var(--deep-red) !important; color: var(--deep-red) !important;
      border-radius: 20px !important; padding: 7px 16px !important;
    }
    .btn-nav-register {
      background: linear-gradient(135deg, var(--saffron), var(--deep-red)) !important;
      color: white !important; border-radius: 20px !important; padding: 7px 16px !important;
    }
    .user-menu { display: flex; align-items: center; gap: 8px; }
    .user-name { font-weight: 600; color: var(--warm-brown); font-size: 0.85rem; }
    .btn-logout {
      background: none; border: 1px solid #ddd; border-radius: 20px;
      padding: 5px 12px; cursor: pointer; font-size: 0.8rem; color: #666;
      transition: all 0.2s;
    }
    .btn-logout:hover { border-color: var(--deep-red); color: var(--deep-red); }
    .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .hamburger span { display: block; width: 24px; height: 2px; background: var(--text-dark); transition: all 0.3s; border-radius: 2px; }
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    @media (max-width: 900px) {
      .hamburger { display: flex; }
      .nav-links {
        position: fixed; top: 70px; left: 0; right: 0;
        background: var(--ivory); flex-direction: column; align-items: stretch;
        padding: 20px; gap: 4px; border-bottom: 2px solid var(--border-light);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        transform: translateY(-110%); opacity: 0; pointer-events: none;
        transition: all 0.3s ease;
      }
      .nav-links.open { transform: translateY(0); opacity: 1; pointer-events: all; }
      .nav-links li { border-bottom: 1px solid var(--border-light); }
      .nav-links li:last-child { border-bottom: none; }
      .nav-links li a { display: block; padding: 12px 8px !important; }
      .user-menu { flex-direction: row; justify-content: space-between; padding: 12px 8px; }
    }
  `]
})
export class NavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

  constructor(public auth: AuthService) {}

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 20); }

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }
  logout() { this.auth.logout(); this.closeMenu(); }
}
