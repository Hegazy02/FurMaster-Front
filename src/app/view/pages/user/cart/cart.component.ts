import { Component, inject } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/interfaces/product.model';
import { CommonModule } from '@angular/common';
import { EmptyDataComponent } from "../../../../shared/empty-data/empty-data.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, EmptyDataComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  ngOnInit() {
    this.cartService.init().subscribe( 
 (items) => this.cartService.cartItemsSubject.next(items),
      (err) => console.error('Failed to load cart', err)
    )
      
     
  }
  get cartItem() {
    return this.cartService.items;
  }


  sellingPrice(product: any) {
    return product.offerPrice ?? product.price;
  }

  addToCart(productId: string, quantity: number) {
    this.cartService.addToCart(productId, quantity).subscribe(result => {
      this.cartService.init();
    })
  }
  get totalAmount() {
    let amount = 0;
    for (let index = 0; index < this.cartItem.length; index++) {
      const element = this.cartItem[index];
      if (element.product) {
        amount += this.sellingPrice(element.product) * element.quantity;
      }
    }
    return amount;
  }


  getDiscountPercent(product: Product) {
    if (!product.price || !product.offerPrice) return 0;
    return Math.round(100 - (product.offerPrice / product.price) * 100);
  }

}
