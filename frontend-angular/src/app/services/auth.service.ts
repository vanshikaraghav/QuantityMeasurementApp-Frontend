// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/quantity.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/v1/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ LOGIN - calls auth-service via gateway
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Store JWT token and user info
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify({
          username: response.username,
          role: response.role
        }));
      })
    );
  }

  // ✅ SIGNUP - calls auth-service via gateway
  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify({
          username: response.username,
          role: response.role
        }));
      })
    );
  }

  // ✅ LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  // ✅ CHECK IF LOGGED IN
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ GET TOKEN (used by interceptor)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ GET CURRENT USER
  getCurrentUser(): { username: string; role: string } | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
