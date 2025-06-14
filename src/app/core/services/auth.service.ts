import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Endpoints } from '../constants/endpoints';
import { AuthResponse, ForgotPasswordResponse, LoginBody, LoginResponse, ResetPasswordData, SignupBody } from '../interfaces/auth.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);


  signup(userData: SignupBody): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(Endpoints.REGISTER, userData);
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

  /////////////////////////////////////////////////////////////
  login(data: LoginBody): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(Endpoints.LOGIN, data);
  }



  // forgetPassword(email: string): Observable<ForgotPasswordResponse> {
  //   return this.http.post<ForgotPasswordResponse>(Endpoints.FORGET, { email }); // ✅ صح
  // }


//   resetPassword(data: ResetPasswordData) {
//     return this.http.post<ResetPasswordData>(Endpoints.RESET,data)


// }
// resetPassword(data: {
//   email: string;
//   otp: string;
//   userOtp: string;
//   password: string;
// }): Observable<ResetPasswordData> {
//   return this.http.post<ResetPasswordData>(Endpoints.RESET,data)
// }
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

}
