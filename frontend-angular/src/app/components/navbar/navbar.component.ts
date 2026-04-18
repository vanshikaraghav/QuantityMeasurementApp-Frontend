import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  constructor(private router: Router, public authService: AuthService) {}
  get isLoggedIn() { return this.authService.isLoggedIn(); }
  get currentUser() { return this.authService.getCurrentUser(); }
  goHome()      { this.router.navigate(['/']); }
  goToLogin()   { this.router.navigate(['/login']); }
  logout()      { this.authService.logout(); this.router.navigate(['/']); }
  toggleTheme() { document.body.classList.toggle('dark'); }
}
