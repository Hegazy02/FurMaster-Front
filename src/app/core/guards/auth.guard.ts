import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export function authGuard(role: string): CanActivateFn {
  return () => {
    const oauthService: AuthService = inject(AuthService);
    const router = inject(Router);
    if (oauthService.user?.role === role) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  };
}
