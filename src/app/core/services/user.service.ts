import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Endpoints } from '../constants/endpoints';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../interfaces/user.interface';
import { ApiResponse } from '../interfaces/api-response.interface';
import { SHOULD_TRACK_LOADING } from '../interceptors/loading.interceptor';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  updateUser(data: [string, any][]): Observable<User> {
    const formData = new FormData();
    data.forEach(([key, value]) => formData.append(key, value));

    return this.http.patch<User>(Endpoints.USER, formData, {
      context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
    });
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
