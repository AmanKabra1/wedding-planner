import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-top">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">🪷 Shaadi Vidhaan</div>
              <p>Your trusted guide to planning authentic Indian weddings and cultural ceremonies across all 28 states.</p>
              <div class="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="YouTube">▶️</a>
                <a href="#" aria-label="WhatsApp">💬</a>
              </div>
            </div>
            <div class="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a routerLink="/states">States & Culture</a></li>
                <li><a routerLink="/rituals">Ritual Guide</a></li>
                <li><a routerLink="/events">Plan Event</a></li>
                <li><a routerLink="/dashboard">Dashboard</a></li>
              </ul>
            </div>
            <div class="footer-links">
              <h4>Event Types</h4>
              <ul>
                <li><a routerLink="/rituals" [queryParams]="{type:'wedding'}">Wedding Ceremony</a></li>
                <li><a routerLink="/rituals" [queryParams]="{type:'engagement'}">Engagement</a></li>
                <li><a routerLink="/rituals" [queryParams]="{type:'childbirth'}">Childbirth Rituals</a></li>
                <li><a routerLink="/rituals" [queryParams]="{type:'mundan'}">Mundan Ceremony</a></li>
              </ul>
            </div>
            <div class="footer-contact">
              <h4>Contact</h4>
              <p>📞 +91-6378781547</p>
              <p>✉️ namaste&#64;shaadividhaan.in</p>
              <p>📍 Jaipur, Rajasthan, India</p>
              <div class="footer-languages">
                <span>हिंदी</span> · <span>English</span> · <span>ਪੰਜਾਬੀ</span> · <span>मराठी</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-ornament">
            <span>🌸</span>
            <div class="divider-line"></div>
            <span>🕉️</span>
            <div class="divider-line"></div>
            <span>🌸</span>
          </div>
          <p>© 2024 Shaadi Vidhaan. Made with ❤️ for Indian culture. | All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: linear-gradient(180deg, #1A0A00 0%, #2C1A0E 100%); color: #D4B896; }
    .footer-top { padding: 60px 0 40px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; }
    @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; } }
    .footer-logo { font-family: 'Yeseva One', serif; font-size: 1.5rem; color: var(--gold); margin-bottom: 12px; }
    .footer-brand p { font-size: 0.9rem; line-height: 1.6; opacity: 0.8; margin-bottom: 16px; }
    .social-links { display: flex; gap: 12px; }
    .social-links a { font-size: 1.3rem; text-decoration: none; transition: transform 0.2s; }
    .social-links a:hover { transform: scale(1.2); }
    .footer-links h4, .footer-contact h4 { color: var(--gold); font-family: 'Playfair Display', serif; margin-bottom: 16px; font-size: 1.1rem; }
    .footer-links ul { list-style: none; padding: 0; }
    .footer-links ul li { margin-bottom: 10px; }
    .footer-links ul li a { color: #D4B896; text-decoration: none; font-size: 0.9rem; opacity: 0.8; transition: all 0.2s; }
    .footer-links ul li a:hover { color: var(--saffron); opacity: 1; padding-left: 4px; }
    .footer-contact p { margin-bottom: 10px; font-size: 0.9rem; }
    .footer-languages { margin-top: 16px; font-size: 0.85rem; opacity: 0.7; }
    .footer-bottom { border-top: 1px solid rgba(212, 175, 55, 0.2); padding: 24px 0; text-align: center; }
    .footer-ornament { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px; }
    .divider-line { width: 60px; height: 1px; background: linear-gradient(to right, transparent, var(--gold), transparent); }
    .footer-bottom p { font-size: 0.85rem; opacity: 0.6; }
  `]
})
export class FooterComponent {}
