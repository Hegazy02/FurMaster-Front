import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Endpoints } from '../constants/endpoints';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../interfaces/user.interface';
import { ApiResponse } from '../interfaces/api-response.interface';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  user: User = {
    id: '1',
    firstName: 'Abdo',
    lastName: 'Hegazy',
    email: 'Hegazy@gmail.com',
    gender: 1,
    phoneNumber: '0123456789',
    city: 'cairo',
    street: 'street',
    address: 'address',
    image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    createdAt: new Date(),
  };
  //api calls
  updateUser(data: [string, any][]): Observable<any> | null {
    const formData = new FormData();
    data.forEach(([key, value]) => formData.append(key, value));

    return this.http.patch(Endpoints.USER, formData);
  }
  getUsers(
    page: number,
    limit: number,
    searchbyEmail: string,
    sort: string
  ): Observable<ApiResponse<User[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('email', searchbyEmail)
      .set('sort', sort);
    return this.http.get<ApiResponse<User[]>>(Endpoints.USERS, { params });
  }
}
