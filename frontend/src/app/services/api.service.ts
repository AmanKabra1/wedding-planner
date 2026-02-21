import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── States ──────────────────────────────────────────────────
  getStates(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/states`); }
  getState(id: number): Observable<any> { return this.http.get<any>(`${this.base}/states/${id}`); }

  // ── Rituals ─────────────────────────────────────────────────
  getRituals(eventType?: string, stateId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (eventType) params = params.set('eventType', eventType);
    if (stateId)   params = params.set('stateId', stateId.toString());
    return this.http.get<any[]>(`${this.base}/rituals`, { params });
  }
  getRitual(id: number): Observable<any>  { return this.http.get<any>(`${this.base}/rituals/${id}`); }
  getEventTypes(): Observable<string[]>   { return this.http.get<string[]>(`${this.base}/rituals/event-types`); }

  // ── User Events ─────────────────────────────────────────────
  getEvents(): Observable<any[]>                  { return this.http.get<any[]>(`${this.base}/events`); }
  createEvent(data: any): Observable<any>         { return this.http.post<any>(`${this.base}/events`, data); }
  updateEvent(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/events/${id}`, data); }
  deleteEvent(id: number): Observable<any>        { return this.http.delete<any>(`${this.base}/events/${id}`); }

  // ── User Bookings ───────────────────────────────────────────
  getBookings(): Observable<any[]>                   { return this.http.get<any[]>(`${this.base}/bookings`); }
  createBooking(data: any): Observable<any>          { return this.http.post<any>(`${this.base}/bookings`, data); }
  updateBooking(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/bookings/${id}`, data); }
  deleteBooking(id: number): Observable<any>         { return this.http.delete<any>(`${this.base}/bookings/${id}`); }

  // ── Profile ─────────────────────────────────────────────────
  getProfile(): Observable<any>          { return this.http.get<any>(`${this.base}/users/profile`); }
  updateProfile(data: any): Observable<any> { return this.http.put<any>(`${this.base}/users/profile`, data); }

  // ── Organizers (Public) ─────────────────────────────────────
  getOrganizers(state?: string): Observable<any[]> {
    let params = new HttpParams();
    if (state) params = params.set('state', state);
    return this.http.get<any[]>(`${this.base}/organizers`, { params });
  }
  getOrganizerPrices(eventType?: string, organizerId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (eventType)    params = params.set('eventType', eventType);
    if (organizerId)  params = params.set('organizerId', organizerId.toString());
    return this.http.get<any[]>(`${this.base}/organizers/prices`, { params });
  }
  getOrganizer(id: number): Observable<any> { return this.http.get<any>(`${this.base}/organizers/${id}`); }

  // ── Organizer Auth ──────────────────────────────────────────
  organizerRegister(data: any): Observable<any> { return this.http.post<any>(`${this.base}/organizers/register`, data); }
  organizerLogin(data: any): Observable<any>    { return this.http.post<any>(`${this.base}/organizers/login`, data); }

  // ── Organizer Price Management ──────────────────────────────
  addOrganizerPrice(data: any): Observable<any>             { return this.http.post<any>(`${this.base}/organizers/prices`, data); }
  updateOrganizerPrice(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/organizers/prices/${id}`, data); }
  deleteOrganizerPrice(id: number): Observable<any>         { return this.http.delete<any>(`${this.base}/organizers/prices/${id}`); }
  updateOrganizerProfile(id: number, data: any): Observable<any> { return this.http.put<any>(`${this.base}/organizers/${id}/profile`, data); }
}
