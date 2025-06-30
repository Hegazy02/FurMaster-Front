import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../constants/endpoints';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Product } from '../../core/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  public wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<ApiResponse<Product[]>> {
    const token = localStorage.getItem('token');
    return this.http.get<ApiResponse<Product[]>>(Endpoints.WISHLIST, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  addToWishlist(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<Product>(`${Endpoints.WISHLIST}/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        const currentItems = this.wishlistItemsSubject.getValue();
        if (!currentItems.find(item => item._id === productId)) {
          this.wishlistItemsSubject.next([...currentItems, { _id: productId } as Product]);
        }
      })
    );
  }

  removeFromWishlist(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${Endpoints.WISHLIST}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        const currentItems = this.wishlistItemsSubject.getValue();
        const updatedItems = currentItems.filter(item => item._id !== productId);
        this.wishlistItemsSubject.next(updatedItems);
      })
    );
  }

  updateWishlistItems(items: Product[]) {
    this.wishlistItemsSubject.next(items);
  }

  getWishlistItemCount(): Observable<number> {
    return this.wishlistItems$.pipe(map(items => items.length));
  }

  init() {
    return this.getWishlist().pipe(
      tap((res) => {
        if (res.success) {
          this.updateWishlistItems(res.data);
        }
      })
    );
  }
}
