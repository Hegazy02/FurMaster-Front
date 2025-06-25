import { User } from "./user.interface";


export interface SignupBody {

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: number;
  phoneNumber: string;
}

export interface AuthResponse {
  message: string;
  data: User;
  token: string;
}

export interface LoginBody {
  email: string;
  password: string;
}


export interface LoginResponse {
  message: string;
  data: string;
}


export interface ForgotPasswordResponse {
  message: string;
  otp: string;
  lastTwoNumbersOfPhoneNumber: string;
}


export interface ResetPasswordData {
  message: string;
}

