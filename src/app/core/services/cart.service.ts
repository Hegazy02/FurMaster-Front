import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.model';
import { Endpoints } from '../constants/endpoints';
import { SHOULD_TRACK_LOADING } from '../interceptors/loading.interceptor';
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  http = inject(HttpClient);

cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  get items(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
  addToCart(productId: string, variantId: string, quantity: number) {
  return this.http.post<CartItem>(
    Endpoints.CART + variantId,
    { productId, quantity: quantity },
    { context: new HttpContext().set(SHOULD_TRACK_LOADING, true) }
  ).pipe(
    tap((newItem: CartItem) => {
      const currentItems = this.cartItemsSubject.getValue();
      this.cartItemsSubject.next([...currentItems, newItem]);
    })
  );
}
  removeFromCart(variantId: string) {
    return this.http.delete(Endpoints.CART + variantId)    .pipe(
      tap(() => {
        const currentItems = this.cartItemsSubject.getValue();
        const updatedItems = currentItems.filter(item => item.variantId !== variantId);
        this.cartItemsSubject.next(updatedItems);
      })
    );
  }

  clearCart() {
    return this.http.delete(Endpoints.CART);
  }

  init() {
    return this.http.get<CartItem[]>(Endpoints.CART).pipe(
    tap((items) => {
      this.cartItemsSubject.next(items); 
    })
  );
  }
}
