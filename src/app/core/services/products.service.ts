import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { AdminProduct } from '../interfaces/admin-product.interface';
import { Endpoints } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient);
  getAdminProducts(
    page: number,
    limit: number,
    searchbyTitle: string,
    sort: string
  ): Observable<ApiResponse<AdminProduct[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('title', searchbyTitle)
      .set('sort', sort);
    return this.http.get<ApiResponse<AdminProduct[]>>(
      Endpoints.ADMIN_PRODUCTS,
      { params }
    );
  }
}
