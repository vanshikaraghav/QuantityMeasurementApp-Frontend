import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.services';

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentity {
  accounts?: {
    id?: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: Record<string, string>) => void;
    };
  };
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('googleSignInContainer', { static: true }) googleSignInContainer?: ElementRef<HTMLDivElement>;

  isRegister = false;
  isSubmitting = false;
  loginEmail = '';
  loginPassword = '';
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  loginError = '';
  registerError = '';
  googleError = '';

  private googleButtonRendered = false;
  private readonly googleClientId = environment.googleClientId;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngAfterViewInit() {
    this.initGoogleButton();
  }

  toggleSection() {
    this.isRegister = !this.isRegister;
    this.loginError = '';
    this.registerError = '';
    this.googleError = '';
  }

  handleLoginSubmit() {
    this.loginError = '';
    this.googleError = '';

    if (!this.loginEmail.trim() || !this.loginPassword.trim()) {
      this.loginError = 'Please enter your email and password.';
      return;
    }

    this.isSubmitting = true;
    this.authService.login({
      email: this.loginEmail.trim(),
      password: this.loginPassword
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.loginError = this.extractErrorMessage(error, 'Login failed. Please check your credentials.');
      }
    });
  }

  handleRegisterSubmit() {
    this.registerError = '';
    this.googleError = '';

    if (!this.registerName.trim() || !this.registerEmail.trim() || !this.registerPassword.trim()) {
      this.registerError = 'Please fill out all fields.';
      return;
    }

    this.isSubmitting = true;
    this.authService.register({
      name: this.registerName.trim(),
      email: this.registerEmail.trim(),
      password: this.registerPassword
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.registerError = this.extractErrorMessage(error, 'Registration failed. Please try again.');
      }
    });
  }

  private initGoogleButton(retryCount = 0) {
    if (!this.googleSignInContainer || this.googleButtonRendered) {
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: (response: GoogleCredentialResponse) => this.handleGoogleResponse(response)
      });

      window.google.accounts.id.renderButton(this.googleSignInContainer.nativeElement, {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'pill'
      });
      this.googleButtonRendered = true;
      return;
    }

    if (retryCount < 20) {
      setTimeout(() => this.initGoogleButton(retryCount + 1), 150);
      return;
    }

    this.googleError = 'Google authentication failed to load. Please refresh the page.';
  }

  private handleGoogleResponse(response: GoogleCredentialResponse) {
    this.googleError = '';

    if (!response.credential) {
      this.googleError = 'Google sign-in failed. Try again.';
      return;
    }

    this.isSubmitting = true;
    this.authService.googleLogin(response.credential).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.googleError = this.extractErrorMessage(error, 'Google sign-in failed. Please try again.');
      }
    });
  }

  private extractErrorMessage(error: HttpErrorResponse, fallback: string) {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 0) {
      return 'Authentication service is unavailable. Make sure the backend is running.';
    }

    return fallback;
  }
}
