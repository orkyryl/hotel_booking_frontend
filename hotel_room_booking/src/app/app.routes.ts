import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent) },
  {
    path: 'admin/rooms/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-room-form/admin-room-form.component').then((m) => m.AdminRoomFormComponent),
  },
  {
    path: 'admin/rooms/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin-room-form/admin-room-form.component').then((m) => m.AdminRoomFormComponent),
  },
  { path: 'room/:id', loadComponent: () => import('./pages/room-detail/room-detail.component').then((m) => m.RoomDetailComponent) },
  { path: '**', redirectTo: '' },
];
