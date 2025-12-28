import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Feeding } from '../models/feeding.model';

@Injectable({
  providedIn: 'root',
})
export class FeedingApiService {
  private readonly httpClient = inject(HttpClient);

  getAllForPet(petId: number, params: { startDate: string; endDate: string }): Observable<Feeding[]> {
    return this.httpClient.get<Feeding[]>(`${environment.apiUrl}/pets/${petId}/feedings`, { params });
  }

  getTodayForPet(petId: number, forceUpdate = false): Observable<Feeding[]> {
    return this.httpClient.get<Feeding[]>(
      `${environment.apiUrl}/pets/${petId}/feedings/today`,
      { headers: forceUpdate ? { 'ngsw-bypass': 'true' } : {} },
    );
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
