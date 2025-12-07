import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SharePetApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private getBaseUrl(): string {
    const userId = this.authService.getCurrentUser()?.userId;
    return `${environment.apiUrl}/users/${userId}`;
  }

  sharePet(petId: number): Observable<{ token: string }> {
    return this.httpClient.get<{ token: string }>(`${this.getBaseUrl()}/pets/${petId}/share`);
  }

  acceptSharedPet(token: string): Observable<void> {
    return this.httpClient.post<void>(`${this.getBaseUrl()}/share/accept`, { token });
  }
}
