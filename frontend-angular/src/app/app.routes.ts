import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',        component: DashboardComponent },                         // PUBLIC
  { path: 'login',   component: LoginComponent },                             // PUBLIC
  { path: 'history', component: HistoryComponent, canActivate: [authGuard] }, // LOGIN REQUIRED
  { path: '**',      redirectTo: '' }
];
