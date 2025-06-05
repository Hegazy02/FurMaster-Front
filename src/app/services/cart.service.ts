import { Injectable ,inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
http=inject(HttpClient);


  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();




get items(): CartItem[]  {
    return this.cartItemsSubject.getValue();
  }



addToCart(productId:string,quantity:number){
return this.http.post(environment.apiUrl +'/carts/' +productId,{
  quantity:quantity,
});
}
removeFromCart(productId:string){
return this.http.delete(environment.apiUrl +'/carts/' +productId);

}



  constructor() { }


    init() {
    this.http.get<CartItem[]>(environment.apiUrl + '/carts').subscribe(
      (items) => this.cartItemsSubject.next(items),
      (err) => console.error('Failed to load cart', err)
    );
  }

}
