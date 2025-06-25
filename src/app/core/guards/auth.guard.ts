import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export function authGuard(role: string): CanActivateFn {
  return () => {
    const authService: AuthService = inject(AuthService);
    const router = inject(Router);
    return authService.getUserRole().pipe(
      map((userRole) => {
        if (userRole === role && authService.getToken()) return true;

        router.navigate(['/login']);
        return false;
      })
    );
  };
}
