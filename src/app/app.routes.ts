import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registration } from './pages/registration/registration';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
