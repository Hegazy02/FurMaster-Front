import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../../../core/interfaces/product.interface';
import { CartService } from '../../../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() fromWishlist: boolean = false;

  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeProduct = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<{
    productId: string;
    selectedColorId: string;
    quantity: number;
    image: string;
    title: string;
    price: number;

  }>();

  cartService = inject(CartService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);
  hovered: boolean = false;
  currentImageIndex: number = 0;


  changeImage(index: number) {
    this.currentImageIndex = index;
  }

  isNewArrival(date: Date): boolean {
    const addedDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = (currentDate.getTime() - addedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30;
  }

  getDiscountPercentage(): number {
    if (this.product && this.product.offerPrice) {
      return Math.round(((this.product.price - this.product.offerPrice) / this.product.price) * 100);
    }
    return 0;
  }

  removeFromWishlist(productId: string) {
    this.removeProduct.emit(productId);
  }

  handleAddToWishlist() {
    if (this.authService.isLoggedIn()) {
      this.addToWishlist.emit(this.product);
    } else {
      this.toastr.warning('Please login to add to wishlist', 'Not Logged In');
      this.router.navigate(['/login']);
    }
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  getFloor(value: number): number {
    return Math.floor(value);
  }

}
