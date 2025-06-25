import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.model';
import { Endpoints } from '../constants/endpoints';
import { SHOULD_TRACK_LOADING } from '../interceptors/loading.interceptor';

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
    return this.http.post(
      Endpoints.CART + variantId,
      {
        productId,
        quantity: quantity,
      },
      {
        context: new HttpContext().set(SHOULD_TRACK_LOADING, true),
      }
    );
  }
  removeFromCart(variantId: string) {
    return this.http.delete(Endpoints.CART + variantId);
  }

  clearCart() {
    return this.http.delete(Endpoints.CART);
  }

  init() {
    return this.http.get<CartItem[]>(Endpoints.CART);
  }
}
