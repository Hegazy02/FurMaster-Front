import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
  AdminProduct,
  AddProduct,
} from '../interfaces/admin-product.interface';
import { Endpoints } from '../constants/endpoints';
import { SHOULD_TRACK_LOADING } from '../interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient);
  getAdminProducts(
    page: number,
    limit: number,
    searchbyTitle: string,
    sortBy: string
  ): Observable<ApiResponse<AdminProduct[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('title', searchbyTitle)
      .set('sortBy', sortBy);
    return this.http.get<ApiResponse<AdminProduct[]>>(
      Endpoints.ADMIN_PRODUCTS,
      { params }
    );
  }
  addProduct(product: AddProduct): Observable<AdminProduct> {
    const formData = this.parseFormData(product);
    return this.http.post<AdminProduct>(Endpoints.ADMIN_PRODUCTS, formData, {
      context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
    });
  }

  private parseFormData(product: AddProduct) {
    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('price', product.price.toString());
    product.offerPrice &&
      formData.append('offerPrice', product.offerPrice!.toString());
    formData.append('description', product.description);
    formData.append('categoryId', product.categoryId);
    const colors = product.colors;
    colors.forEach((item, index) => {
      formData.append(`colors[${index}][colorId]`, item.colorId);
      formData.append(`colors[${index}][stock]`, item.stock.toString());
      formData.append(`colors[${index}][image]`, item.image);
    });
    return formData;
  }
}
