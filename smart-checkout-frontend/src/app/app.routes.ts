import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.page').then( m => m.LoginPagePage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup-page/signup-page.page').then( m => m.SignupPagePage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page.page').then( m => m.HomePagePage)
  },
];
