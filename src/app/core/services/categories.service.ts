import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/product.model';
import { Endpoints } from '../constants/endpoints';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  http = inject(HttpClient);
  getCategories(name: string): Observable<ApiResponse<Category[]>> | null {
    const params = new HttpParams().set('search', name);
    return this.http.get<ApiResponse<Category[]>>(Endpoints.CATEGORIES, {
      params,
    });
  }
}
