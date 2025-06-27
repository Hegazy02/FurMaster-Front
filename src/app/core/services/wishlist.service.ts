import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../constants/endpoints';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Product } from '../../core/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient) { }

  getWishlist(): Observable<ApiResponse<Product[]>> {
    const token = localStorage.getItem('token');
    return this.http.get<ApiResponse<Product[]>>(Endpoints.WISHLIST, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  addToWishlist(productId: string): Observable<ApiResponse<Product[]>> {
    const token = localStorage.getItem('token');
    return this.http.post<ApiResponse<Product[]>>(`${Endpoints.WISHLIST}/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  removeFromWishlist(productId: string): Observable<ApiResponse<Product[]>> {
    const token = localStorage.getItem('token');
    return this.http.delete<ApiResponse<Product[]>>(`${Endpoints.WISHLIST}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
