import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export function authGuard(role: string): CanActivateFn {
  return () => {
    const oauthService: AuthService = inject(AuthService);
    const router = inject(Router);
    return oauthService.getUserRole().pipe(
      map((userRole) => {
        if (userRole === role) return true;

        router.navigate(['/login']);
        return false;
      })
    );
  };
}
