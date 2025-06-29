import { CommonModule } from '@angular/common';
import { Product } from '.././../../../../../core/interfaces/product.interface';
import { RouterModule } from '@angular/router';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CartService } from '../../../../../../core/services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PrimaryButtonComponent } from "../../../../../../shared/primary-button/primary-button.component";
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';
import { WishlistService } from '../../../../../../core/services/wishlist.service';
import { CartItem } from '../../../../../../core/interfaces/cart-item.model';



@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimaryButtonComponent],
  templateUrl: './product-info.component.html',
})
export class ProductInfoComponent implements OnInit {
  @Input() product!: Product;
  @Input() categoryName: string = '';
  authService = inject(AuthService);
  router = inject(Router);
  wishlistService = inject(WishlistService);


  isInCart: boolean = false;
  isInWishlist: boolean = false;
  imageFading = false;
  selectedColorIndex = 0;
  hoveredColorIndex: number | null = null;
  hoveredThumbnailIndex: number | null = null;
  mainImage = '';
  thumbnailImages: string[] = [];
  quantity = 1;
  cartService = inject(CartService);
  private destroy$ = new Subject<void>();
  toastr = inject(ToastrService);

ngOnInit(): void {
   this.cartService.init().subscribe();
  this.mainImage = this.product.colors?.[0]?.image || '';
  this.thumbnailImages = this.product.colors.map((c) => c.image).filter(Boolean) as string[];

 this.cartService.cartItems$
    .pipe(takeUntil(this.destroy$))
    .subscribe((items) => {
      this.checkIfInCart(items); 
    });

  this.checkIfInCart(this.cartService.items);
  this.checkIfInWishlist();
}


  onColorLeave(): void {
    this.hoveredColorIndex = null;
    const image = this.product.colors?.[this.selectedColorIndex]?.image;
    if (image) this.mainImage = image;
  }

onColorSelect(index: number): void {
  this.selectedColorIndex = index;
    this.quantity = 1; 
  const image = this.product.colors?.[index]?.image;
  if (image) this.mainImage = image;
  this.checkIfInCart(this.cartService.items);
}


  onThumbnailLeave(): void {
    this.hoveredThumbnailIndex = null;
    const image = this.product.colors?.[this.selectedColorIndex]?.image;
    if (image) this.mainImage = image;
  }

  switchMainImage(newImage: string) {
    if (this.mainImage === newImage) return;

    this.imageFading = true;
    setTimeout(() => {
      this.mainImage = newImage;
    }, 250);
  }

  onImageLoad() {
    setTimeout(() => {
      this.imageFading = false;
    }, 50);
  }

  onThumbnailHover(index: number): void {
    this.hoveredThumbnailIndex = index;
    const image = this.thumbnailImages[index];
    if (image) this.switchMainImage(image);
  }

  onThumbnailClick(index: number): void {
    this.switchMainImage(this.thumbnailImages[index]);

    const colorIndex = this.product.colors.findIndex(
      (c) => c.image === this.thumbnailImages[index]
    );
    if (colorIndex !== undefined && colorIndex >= 0) {
      this.selectedColorIndex = colorIndex;
      this.checkIfInCart(this.cartService.items);
    }
  }

  onColorHover(index: number): void {
    this.hoveredColorIndex = index;
    const image = this.product.colors?.[index]?.image;
    if (image) this.switchMainImage(image);
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  getStarClass(index: number, rating: number): string {
    if (index < Math.floor(rating)) return 'text-yellow-400 fill-current';
    else if (index < rating) return 'text-yellow-400 fill-current opacity-50';
    else return 'text-gray-300 fill-current';
  }

  getColorHexByIndex(index: number): string {
    return this.product.colors?.[index]?.hex || '#000000';
  }

  getColorNameByIndex(index: number): string {
    return this.product.colors?.[index]?.name || '';
  }

  getSelectedColorStock(): number {
    return this.product.colors?.[this.selectedColorIndex]?.stock || 0;
  }

  getSelectedColorName(): string {
    return this.getColorNameByIndex(this.selectedColorIndex);
  }

  isInStock(): boolean {
    return this.getSelectedColorStock() > 0;
  }

  getSavingsAmount(): number {
    if (!this.product.price || !this.product.offerPrice) return 0;
    return this.product.price - this.product.offerPrice;
  }

  getSavingsPercentage(): number {
    if (!this.product.price || !this.product.offerPrice) return 0;
    return Math.round(
      ((this.product.price - this.product.offerPrice) / this.product.price) *
      100
    );
  }

  getCurrentPrice(): number {
    return this.product.offerPrice || this.product.price || 0;
  }

  increaseQuantity(): void {
    const maxStock = this.getSelectedColorStock();
    if (this.quantity < maxStock) this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
    return;
  }

  if (!this.isInStock()) return;

  const cartItem = {
    productId: this.product._id,
    title: this.product.title,
    price: this.getCurrentPrice(),
    quantity: this.quantity,
    selectedColor: {
      _id: this.product.colors?.[this.selectedColorIndex]?._id,
      colorId: this.product.colors?.[this.selectedColorIndex]?.colorId,
      name: this.getSelectedColorName(),
      hex: this.getColorHexByIndex(this.selectedColorIndex),
    },
    image: this.mainImage,
  };

  this.cartService.addToCart(cartItem.productId, cartItem.selectedColor._id, cartItem.quantity)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.toastr.success(`Added ${this.quantity} ${this.product.title} (${this.getSelectedColorName()}) to cart!`);

        const key = `cart_${cartItem.productId}_${cartItem.selectedColor._id}`;
        localStorage.setItem(key, 'true');
        this.cartService.init().subscribe();

      },
      error: () => this.toastr.error('Failed to add to cart'),
    });
}


removeFromCart(): void {
  const productId = this.product._id;
  const selectedColorId = this.product.colors?.[this.selectedColorIndex]?._id;

  if (!selectedColorId) return;

  this.cartService.removeFromCart(selectedColorId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.toastr.info(`Removed ${this.product.title} (${this.getSelectedColorName()}) from cart.`);

        const key = `cart_${productId}_${selectedColorId}`;
        localStorage.removeItem(key);
        this.cartService.init().subscribe();

      },
      error: () => this.toastr.error('Failed to remove from cart'),
    });
}

toggleCart(): void {
  if (this.isInCart) {
    this.removeFromCart();
  } else {
    this.addToCart();
  }
}

checkIfInCart(cartItems: CartItem[]): void {
  const selectedColorId = this.product.colors?.[this.selectedColorIndex]?._id;
  this.isInCart = cartItems.some(
    (item) => item.productId === this.product._id && item.variantId === selectedColorId
  );
}




toggleWishlist(): void {
  if (this.isInWishlist) {
    this.wishlistService.removeFromWishlist(this.product._id).subscribe({
      next: () => {
        this.toastr.info(`${this.product.title} removed from wishlist 💔`);
        this.isInWishlist = false;
      },
      error: () => this.toastr.error('Failed to remove from wishlist')
    });
  } else {
    this.wishlistService.addToWishlist(this.product._id).subscribe({
      next: () => {
        this.toastr.success(`${this.product.title} added to wishlist ❤️`);
        this.isInWishlist = true;
      },
      error: () => this.toastr.error('Failed to add to wishlist')
    });
  }
}

  checkIfInWishlist(): void {
  this.wishlistService.getWishlist().subscribe({
    next: (res) => {
      this.isInWishlist = res.data.some(p => p._id === this.product._id);
    },
    error: (err) => console.error('Error checking wishlist', err)
  });
}
goToWishlist(): void {
  this.router.navigate(['/wishlist']);
}


  shareProduct(): void {
    if (navigator.share && this.product) {
      navigator.share({
        title: this.product.title,
        text: this.product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      this.toastr.info('Product URL copied to clipboard!');
    }
  }

  ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

}
