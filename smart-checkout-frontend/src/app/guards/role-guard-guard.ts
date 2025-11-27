import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/authService/auth';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  canActivate(): boolean {
    const user = authService.getUser();
    if(user && user.role_id === 1) return true;
    router.navigate(['/home']);
    return false;
  }
  // return true;
};
