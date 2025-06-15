import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Endpoints } from '../constants/endpoints';
import {
  AuthResponse,
  LoginBody,
  SignupBody,
} from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';
import { SHOULD_TRACK_LOADING } from '../interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  user?: User;
  signup(userData: SignupBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(Endpoints.REGISTER, userData, {
      context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
    });
  }
  login(data: LoginBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(Endpoints.LOGIN, data, {
      context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
    });
  }
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getUser(): Observable<User> {
    return this.http.get<User>(Endpoints.USER);
  }
  logout(): void {
    localStorage.removeItem('token');
  }
  getUserRole(): Observable<string | null> {
    if (this.user) return of(<string>this.user.role);
    return this.getUser().pipe(
      map((user) => user.role),
      catchError(() => of(null))
    );
  }
}
