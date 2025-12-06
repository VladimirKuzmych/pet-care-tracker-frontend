import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly httpClient = inject(HttpClient);

  patchUser(userId: string, data: UpdateUserRequest): Observable<UserResponse> {
    return this.httpClient.patch<UserResponse>(`${environment.apiUrl}/users/${userId}`, data);
  }

  changePassword(userId: string, data: UpdatePasswordRequest): Observable<void> {
    return this.httpClient.patch<void>(`${environment.apiUrl}/users/${userId}/password`, data);
  }
}
