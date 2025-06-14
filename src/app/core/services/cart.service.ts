import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart-item.model';
import { Endpoints } from '../constants/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  http = inject(HttpClient);


   cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();


  get items(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }



  addToCart(productId: string, quantity: number) {
    return this.http.post(Endpoints.CART + productId, {
      quantity: quantity,
    });
  }
  removeFromCart(productId: string) {
    return this.http.delete(Endpoints.CART + productId);

  }


  init() {
    return this.http.get<CartItem[]>(Endpoints.CART )

      

}}
