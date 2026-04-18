import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  provider: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleLogin(credential: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/google-login`, { credential }).pipe(
      tap(response => this.storeAuthData(response))
    );
  }
  private readonly baseUrl = `${environment.apiGatewayUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(response => this.storeAuthData(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, request).pipe(
      tap(response => this.storeAuthData(response))
    );
  }

  logout(): void {
    localStorage.removeItem('qma_token');
    localStorage.removeItem('qmaUser');
  }

  getToken(): string | null {
    return localStorage.getItem('qma_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = this.parseJwt(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): { name: string; email: string; role: string } | null {
    try {
      return JSON.parse(localStorage.getItem('qmaUser') || 'null');
    } catch {
      return null;
    }
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('qma_token', response.token);
    localStorage.setItem('qmaUser', JSON.stringify({
      name: response.username,
      email: response.email,
      role: response.role
    }));
  }

  private parseJwt(token: string): any {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
