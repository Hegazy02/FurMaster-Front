export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: number;
  phoneNumber: string;
  image?: string;
  city?: string;
  street?: string;
  address?: string;
  createdAt: Date;
  role: UserRole;
  isActive: boolean;
}
export enum UserRole {
  Admin = 'admin',
  User = 'user',
}
