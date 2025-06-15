import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Endpoints } from '../constants/endpoints';
import {
  AuthResponse,
  ForgotPasswordResponse,
  LoginBody,
  ResetPasswordData,
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


  logout(): void {
    localStorage.removeItem('token');
  }


  resetPassword(data: {
    email: string;
    otp: string;
    userOtp: string;
    password: string;
  }): Observable<ResetPasswordData> {
    return this.http.post<ResetPasswordData>(Endpoints.RESET, data);
  }

  forgetPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(Endpoints.FORGET, { email });
  }


  getUser(): Observable<User> {
    return this.http.get<User>(Endpoints.USER);
  }
  getUserRole(): Observable<string | null> {
    if (this.user) return of(<string>this.user.role);
    return this.getUser().pipe(
      map((user) => {
        this.user = user;
        return user.role;
      }),
      catchError(() => of(null))
    );
  }

}
