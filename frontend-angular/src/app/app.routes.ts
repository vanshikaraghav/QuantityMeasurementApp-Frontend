import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: 'dashboard' }
];
