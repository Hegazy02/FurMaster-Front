import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import {
  AdminProduct,
  AddProduct,
  AdminProductVariant,
} from '../interfaces/admin-product.interface';
import { Endpoints } from '../constants/endpoints';
import { Product } from '../../core/interfaces/product.interface';
import { Category } from '../../core/interfaces/category.interface';
import { SHOULD_TRACK_LOADING } from '../interceptors/loading.interceptor';
import { ProductQueryParams } from '../../core/interfaces/product.interface';

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
    const formData = this.parseToFormData(product, true);
    return this.http.post<AdminProduct>(Endpoints.ADMIN_PRODUCTS, formData, {
      context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
    });
  }

  private parseToFormData(product: AddProduct, hasColors?: boolean) {
    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('price', product.price.toString());
    product.offerPrice &&
      formData.append('offerPrice', product.offerPrice!.toString());
    formData.append('description', product.description);
    formData.append('categoryId', product.categoryId);
    if (hasColors) {
      const colors = product.colors;
      colors.forEach((item, index) => {
        formData.append(`colors[${index}][colorId]`, item.colorId);
        formData.append(`colors[${index}][stock]`, item.stock.toString());
        formData.append(`colors[${index}][image]`, item.image);
      });
    }
    return formData;
  }
  getProduct(id: string): Observable<ApiResponse<AdminProduct>> {
    return this.http.get<ApiResponse<AdminProduct>>(
      `${Endpoints.PRODUCTS}/${id}`
    );
  }
  updateProduct(id: string, product: AddProduct): Observable<AdminProduct> {
    const formData = this.parseToFormData(product);

    return this.http.patch<AdminProduct>(
      `${Endpoints.ADMIN_PRODUCTS}/${id}`,
      formData,
      {
        context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
      }
    );
  }
  deleteProduct(id: string): Observable<AdminProduct> {
    return this.http.delete<AdminProduct>(`${Endpoints.ADMIN_PRODUCTS}/${id}`, {
      context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
    });
  }
  addProductVariant(
    productId: string,
    variant: AdminProductVariant
  ): Observable<AdminProduct> {
    const formData = new FormData();
    formData.append('colorId', variant.colorId);
    formData.append('stock', variant.stock.toString());
    formData.append('image', variant.image!);

    return this.http.post<AdminProduct>(
      `${Endpoints.ADMIN_PRODUCTS}/${productId}/variant`,
      formData
    );
  }
  updateProductVariant(
    productId: string,
    variant: AdminProductVariant
  ): Observable<AdminProduct> {
    const formData = new FormData();
    formData.append('colorId', variant.colorId);
    formData.append('stock', variant.stock.toString());
    formData.append('image', variant.image!);

    return this.http.patch<AdminProduct>(
      `${Endpoints.ADMIN_PRODUCTS}/${productId}/variant/${variant._id}`,
      formData
    );
  }

  deleteProductVariant(
    productId: string,
    variantId: string
  ): Observable<AdminProduct> {
    return this.http.delete<AdminProduct>(
      `${Endpoints.ADMIN_PRODUCTS}/${productId}/variant/${variantId}`
    );
  }
  ////////////////////////// get user products/////////////////////////
  getProducts(filters: ProductQueryParams): Observable<ApiResponse<Product[]>> {
    let params = new HttpParams()
      .set('minPrice', filters.minPrice?.toString() || '0')
      .set('maxPrice', filters.maxPrice?.toString() || '100000');

    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.key) params = params.set('key', filters.key);
    if (filters.categoryId?.length) {

      params = params.set('categoryId', filters.categoryId.join(','));
    }
    if (filters.colorId?.length)
      params = params.set('colorId', filters.colorId.join(','));

    return this.http.get<ApiResponse<Product[]>>(Endpoints.PRODUCTS, {
      params,
    });
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(Endpoints.CATEGORIES);
  }

  getColors(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(Endpoints.COLORS);
  }

  getProductById(id: string): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${Endpoints.PRODUCTS}/${id}`)
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error('Product not found');
          }
        }),
        catchError((error) => {
          console.error('Error fetching product:', error);
          return throwError(() => error);
        })
      );
  }

  getRelatedProducts(
    categoryId: string,
    excludeProductId: string
  ): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(
        `${Endpoints.PRODUCTS}?categoryId=${categoryId}&limit=4`
      )
      .pipe(
        map((response) => {
          if (response.success && response.data) {
            return response.data.filter((p) => p._id !== excludeProductId);
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error fetching related products:', error);
          return throwError(() => error);
        })
      );
  }
}
