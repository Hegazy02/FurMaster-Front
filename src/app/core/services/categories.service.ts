import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from '../constants/endpoints';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CategoryProductsResponse, CategoryListResponse, CategoryDetailResponse } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  http = inject(HttpClient);


  getCategories(params?: { search?: string; page?: number } | string): Observable<CategoryListResponse> {
    let httpParams = new HttpParams();

    if (typeof params === 'string') {
      httpParams = httpParams.set('search', params);
    } else if (typeof params === 'object') {
      if (params?.page) httpParams = httpParams.set('page', params.page.toString());
      if (params?.search) httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<CategoryListResponse>(Endpoints.CATEGORIES, { params: httpParams });
  }

 
  getCategoryById(id: string): Observable<CategoryDetailResponse> {
    return this.http.get<CategoryDetailResponse>(`${Endpoints.CATEGORIES}/${id}`);
  }


  getProductsByCategoryId(categoryId: string, page: number = 1): Observable<CategoryProductsResponse> {
    const params = new HttpParams()
      .set('categoryId', categoryId)
      .set('page', page);

    return this.http.get<CategoryProductsResponse>(Endpoints.PRODUCTS, { params });
  }
}