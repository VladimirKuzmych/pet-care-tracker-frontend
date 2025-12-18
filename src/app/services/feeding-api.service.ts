import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Feeding, FeedingSummary } from '../models/feeding.model';

@Injectable({
  providedIn: 'root',
})
export class FeedingApiService {
  private readonly httpClient = inject(HttpClient);

  getAllForPet(petId: number): Observable<Feeding[]> {
    return this.httpClient.get<Feeding[]>(`${environment.apiUrl}/pets/${petId}/feedings`);
  }

  getPetTodaySummary(petId: number): Observable<FeedingSummary> {
    return this.httpClient.get<FeedingSummary>(`${environment.apiUrl}/feedings/summary/pets/${petId}/today`);
  }

  getTodaySummary(userId: string): Observable<FeedingSummary[]> {
    return this.httpClient.get<FeedingSummary[]>(`${environment.apiUrl}/feedings/summary/users/${userId}/today`);
  }

  create(petId: number, feeding: Feeding): Observable<Feeding> {
    return this.httpClient.post<Feeding>(`${environment.apiUrl}/pets/${petId}/feedings`, feeding);
  }

  update(petId: number, feedingId: number, feeding: Feeding): Observable<Feeding> {
    return this.httpClient.put<Feeding>(`${environment.apiUrl}/pets/${petId}/feedings/${feedingId}`, feeding);
  }

  delete(petId: number, feedingId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/pets/${petId}/feedings/${feedingId}`);
  }
}
