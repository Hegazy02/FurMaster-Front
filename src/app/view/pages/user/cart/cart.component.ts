import { Component, inject } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/interfaces/product.model';
import { CommonModule } from '@angular/common';
import { EmptyDataComponent } from '../../../../shared/empty-data/empty-data.component';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '../../../../core/constants/endpoints';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, EmptyDataComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartService = inject(CartService);
  http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  loading = true;

  ngOnInit() {
    this.cartService
      .init()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (items) => {
this.cartService.cartItemsSubject.next(items);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
        this.loading = false;
      }
    });
}



  get cartItem() {
    return this.cartService.cartItemsSubject.value;
  }

  sellingPrice(item: any): number {
    return item.offerPrice ?? item.price ?? 0;
  }

  addToCart(variantId: string, productId: string, quantity: number) {
    this.cartService
      .addToCart(variantId, productId, quantity)
      .subscribe((result) => {
        this.cartService.init();
      });
  }

  get totalAmount() {
    return this.cartItem.reduce((total, item) => {
      const price = this.sellingPrice(item);
      return total + price * item.quantity;
    }, 0);
  }

  get discount(): number {
    return this.getDiscount(this.totalAmount);
  }

  get totalPrice(): number {
    return this.totalAmount - this.discount;
  }

  getDiscount(price: number): number {
    if (price > 500000) {
      return price * 0.1;
    }
    return 0;
  }

  getDiscountPercent(product: Product) {
    if (!product.price || !product.offerPrice) return 0;
    return Math.round(100 - (product.offerPrice / product.price) * 100);
  }

  async checkout() {
    console.log('checkout started');

    const stripe = await loadStripe(Endpoints.STRIPE_PUBLIC_KEY);
    const products = this.cartItem.map((item) => ({
      name: item.title,
      price: this.sellingPrice(item),
      quantity: item.quantity,
      productId: item._id,
      variantId: item.variantId,
      image: item.image, ///
    }));
    this.http
      .post<any>(`${Endpoints.BASE_URL}/api/stripe/create-checkout-session`, {
        products: products,
      })
      .subscribe(async (res) => {
        if (res.url) {
          console.log(res);

          window.location.href = res.url;
        } else {
          console.log('fail');
        }
      });
  }

  updateQuantity(variantId: string, productId: string, newQuantity: number) {
    if (!variantId || newQuantity < 1) return;

    this.cartService
      .addToCart(productId, variantId, newQuantity)
      .subscribe(() => {
        this.cartService.init().subscribe((items) => {
this.cartService.cartItemsSubject.next(items);
        });
      });
  }

  removeItem(variantId: string) {
    this.cartService.removeFromCart(variantId).subscribe(() => {
      this.cartService.init().subscribe((items) => {
this.cartService.cartItemsSubject.next(items);
      });
    });
  }
  clearCart() {
    console.log('start');
    this.cartService.clearCart().subscribe({
      next: () => {
this.cartService.cartItemsSubject.next([]);
      },
      error: (err) => {
        console.log('clear error', err);
      },
    });
  }

 getTotalQuantity(): number {
  return this.cartItem.reduce((total, item) => total + item.quantity, 0);
}

getStock(productId: string, variantId: string): number {
  const item = this.cartItem.find(
    i => i.productId === productId && i.variantId === variantId
  );
  return item?.stock ?? 0;
}

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
}
