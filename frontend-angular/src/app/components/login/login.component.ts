import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isLogin = true;
  usernameError = false;
  passwordError = false;
  errorMessage = '';
  loading = false;

  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/history']);
  }

  toggle()      { this.isLogin = !this.isLogin; this.errorMessage = ''; }
  toggleTheme() { document.body.classList.toggle('dark'); }
  goBack()      { this.router.navigate(['/']); }

  submit() {
    this.usernameError = this.username.trim().length < 3;
    this.passwordError = this.password.length < 4;
    this.errorMessage = '';
    if (this.usernameError || this.passwordError) return;

    this.loading = true;
    const action$ = this.isLogin
      ? this.authService.login({ username: this.username, password: this.password })
      : this.authService.signup({ username: this.username, password: this.password });

    action$.subscribe({
      next: () => { this.loading = false; this.router.navigate(['/history']); },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || (this.isLogin ? 'Invalid credentials.' : 'Signup failed.');
      }
    });
  }
}
