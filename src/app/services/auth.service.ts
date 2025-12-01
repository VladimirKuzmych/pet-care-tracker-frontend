import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthApiService, AuthResponse, LoginRequest, RegisterRequest } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private authResponseSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredAuthResponse());
  public authResponse$ = this.authResponseSubject.asObservable();

  constructor(private authApi: AuthApiService) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authApi.login(credentials).pipe(
      tap(response => this.setAuthResponse(response))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.authApi.register(userData).pipe(
      tap(response => this.setAuthResponse(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authResponseSubject.next(null);
  }

  getToken(): string | null {
    return this.authResponseSubject.value?.token || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthResponse | null {
    return this.authResponseSubject.value;
  }

  private setAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(response));
    this.authResponseSubject.next(response);
  }

  private getStoredAuthResponse(): AuthResponse | null {
    const stored = localStorage.getItem(this.TOKEN_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}