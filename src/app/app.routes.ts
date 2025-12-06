import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registration } from './pages/registration/registration';
import { Dashboard } from './pages/dashboard/dashboard';
import { AddPet } from './pages/add-pet/add-pet';
import { EditPet } from './pages/edit-pet/edit-pet';
import { Feedings } from './pages/feedings/feedings';
import { UserLayout } from './layouts/user-layout/user-layout';
import { authGuard } from './guards/auth.guard';
import { PetList } from './components/pet-list/pet-list';
import { UserProfile } from './pages/user-profile/user-profile';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registration', component: Registration },
  {
    path: '',
    component: UserLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'pets', component: PetList },
      { path: 'add-pet', component: AddPet },
      { path: 'edit-pet/:id', component: EditPet },
      { path: 'feedings', component: Feedings },
      { path: 'profile', component: UserProfile },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];
