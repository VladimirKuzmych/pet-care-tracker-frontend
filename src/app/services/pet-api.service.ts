import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pet } from '../models/pet.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PetApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private getBaseUrl(): string {
    const userId = this.authService.getCurrentUser()?.userId;
    return `${environment.apiUrl}/users/${userId}/pets`;
  }

  create(pet: Pet): Observable<Pet> {
    return this.httpClient.post<Pet>(this.getBaseUrl(), pet);
  }

  getAll(): Observable<Pet[]> {
    return this.httpClient.get<Pet[]>(this.getBaseUrl());
  }

  getById(petId: number): Observable<Pet> {
    return this.httpClient.get<Pet>(`${this.getBaseUrl()}/${petId}`);
  }

  update(petId: number, pet: Pet): Observable<Pet> {
    return this.httpClient.put<Pet>(`${this.getBaseUrl()}/${petId}`, pet);
  }

  delete(petId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.getBaseUrl()}/${petId}`);
  }
}
