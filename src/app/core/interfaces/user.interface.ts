export interface User {
  id: string;
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
}
