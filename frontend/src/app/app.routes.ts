import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'states', loadComponent: () => import('./components/states/states.component').then(m => m.StatesComponent) },
  { path: 'states/:id', loadComponent: () => import('./components/states/state-detail.component').then(m => m.StateDetailComponent) },
  { path: 'rituals', loadComponent: () => import('./components/rituals/rituals.component').then(m => m.RitualsComponent) },
  { path: 'rituals/:id', loadComponent: () => import('./components/rituals/ritual-detail.component').then(m => m.RitualDetailComponent) },
  { path: 'organizers', loadComponent: () => import('./components/organizers/organizers.component').then(m => m.OrganizersComponent) },
  { path: 'organizer-dashboard', loadComponent: () => import('./components/organizers/organizer-dashboard.component').then(m => m.OrganizerDashboardComponent) },
  { path: 'events', loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent), canActivate: [authGuard] },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent) },
  { path: '**', redirectTo: '' }
];