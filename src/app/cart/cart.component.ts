import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
cartService=inject(CartService);
ngOnInit(){
  this.cartService.init();
}
get cartItem(){
return this.cartService.items;
}


sellingPrice(product: any) {
  return product.offerPrice ?? product.price;
}

addToCart(productId:string,quantity:number){
  this.cartService.addToCart(productId,quantity).subscribe(result=>{
    this.cartService.init();
  })
}
get totalAmount(){
  let amount=0;
  for(let index=0;index<this.cartItem.length;index++){
    const element=this.cartItem[index];
if (element.product) {
  amount += this.sellingPrice(element.product) * element.quantity;
}  }
return amount;
}


getDiscountPercent(product: Product) {
  if (!product.price || !product.offerPrice) return 0;
  return Math.round(100 - (product.offerPrice / product.price) * 100);
}

}
