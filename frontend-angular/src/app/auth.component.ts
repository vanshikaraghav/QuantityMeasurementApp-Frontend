import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare global {
  interface Window {
    google?: any;
  }
}

interface StoredUser {
  name: string;
  email: string;
  password: string;
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
  loginEmail = '';
  loginPassword = '';
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  loginError = '';
  registerError = '';
  googleError = '';

  private readonly GOOGLE_CLIENT_ID = "518513198833-touajoprehvcp9bitk7bv3n8kaauhbd7.apps.googleusercontent.com";

  constructor(private router: Router) {
    const user = this.loadCurrentUser();
    if (user) {
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
    const storedUser = this.getStoredUser();

    if (!storedUser || storedUser.email !== this.loginEmail || storedUser.password !== this.loginPassword) {
      this.loginError = 'Invalid email or password.';
      return;
    }

    localStorage.setItem('qmaUser', JSON.stringify({ name: storedUser.name, email: storedUser.email }));
    this.router.navigate(['/dashboard']);
  }

  handleRegisterSubmit() {
    this.registerError = '';

    if (!this.registerName.trim() || !this.registerEmail.trim() || !this.registerPassword.trim()) {
      this.registerError = 'Please fill out all fields.';
      return;
    }

    const storedUser = this.getStoredUser();
    if (storedUser && storedUser.email === this.registerEmail.trim()) {
      this.registerError = 'Email already registered. Please log in.';
      return;
    }

    const user: StoredUser = {
      name: this.registerName.trim(),
      email: this.registerEmail.trim(),
      password: this.registerPassword
    };

    localStorage.setItem('qmaStoredUser', JSON.stringify(user));
    localStorage.setItem('qmaUser', JSON.stringify({ name: user.name, email: user.email }));
    this.router.navigate(['/dashboard']);
  }

  private initGoogleButton(retryCount = 0) {
    if (!this.googleSignInContainer) {
      return;
    }

    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: (response: any) => this.handleGoogleResponse(response)
      });

      window.google.accounts.id.renderButton(this.googleSignInContainer.nativeElement, {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'pill'
      });
      return;
    }

    if (retryCount < 20) {
      setTimeout(() => this.initGoogleButton(retryCount + 1), 150);
      return;
    }

    this.googleError = 'Google authentication failed to load. Please refresh the page.';
  }

  private handleGoogleResponse(response: any) {
    const payload = this.parseJwtToken(response?.credential || '');
    if (!payload?.email) {
      this.googleError = 'Google sign-in failed. Try again.';
      return;
    }

    const user = {
      name: payload.name || payload.email,
      email: payload.email,
      avatar: payload.picture || ''
    };

    localStorage.setItem('qmaUser', JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  signInWithGoogle() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
      return;
    }

    this.googleError = 'Google sign-in is not ready yet. Please refresh the page in a moment.';
  }

  private parseJwtToken(token: string) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private loadCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('qmaUser') || 'null');
    } catch {
      return null;
    }
  }

  private getStoredUser(): StoredUser | null {
    try {
      return JSON.parse(localStorage.getItem('qmaStoredUser') || 'null');
    } catch {
      return null;
    }
  }
}
