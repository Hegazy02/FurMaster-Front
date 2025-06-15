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



  addToCart(productId: string,variantId: string, quantity: number) {
    return this.http.post(Endpoints.CART + variantId, {
      productId,
      quantity: quantity,
    });
  }
  removeFromCart(variantId: string) {
    return this.http.delete(Endpoints.CART + variantId);

  }

clearCart() {
  return this.http.delete('http://localhost:3000/api/cart');
}

  init() {
    return this.http.get<CartItem[]>(Endpoints.CART )

   
  

}}
