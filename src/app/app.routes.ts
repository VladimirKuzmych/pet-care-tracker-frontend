import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registration } from './pages/registration/registration';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddPet } from './pages/add-pet/add-pet';
import { EditPet } from './pages/edit-pet/edit-pet';
import { Feedings } from './pages/feedings/feedings';
import { UserLayout } from './layouts/user-layout/user-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  {
    path: '',
    component: UserLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'add-pet', component: AddPet },
      { path: 'edit-pet/:id', component: EditPet },
      { path: 'feedings', component: Feedings },
      { path: '', redirectTo: '/feedings', pathMatch: 'full' }
    ]
  }
];
