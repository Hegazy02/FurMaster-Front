import { CommonModule } from '@angular/common';
import { Product } from '.././../../../../../core/interfaces/product.interface';
import { RouterModule } from '@angular/router';
import { Component, inject, Input, OnInit } from '@angular/core';
import { CartService } from '../../../../../../core/services/cart.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-info.component.html',
})
export class ProductInfoComponent implements OnInit {
  @Input() product!: Product;
  @Input() categoryName: string = '';

  selectedColorIndex = 0;
  hoveredColorIndex: number | null = null;
  hoveredThumbnailIndex: number | null = null;
  mainImage = '';
  thumbnailImages: string[] = [];
  quantity = 1;
  cartService = inject(CartService);
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.mainImage = this.product.colors?.[0]?.image || '';
    this.thumbnailImages = this.product.colors
      .map((c) => c.image)
      .filter(Boolean) as string[];
  }

  onColorHover(index: number): void {
    this.hoveredColorIndex = index;
    const image = this.product.colors?.[index]?.image;
    if (image) this.mainImage = image;
  }

  onColorLeave(): void {
    this.hoveredColorIndex = null;
    const image = this.product.colors?.[this.selectedColorIndex]?.image;
    if (image) this.mainImage = image;
  }

  onColorSelect(index: number): void {
    this.selectedColorIndex = index;
    const image = this.product.colors?.[index]?.image;
    if (image) this.mainImage = image;
  }

  onThumbnailHover(index: number): void {
    this.hoveredThumbnailIndex = index;
    if (this.thumbnailImages[index]) {
      this.mainImage = this.thumbnailImages[index];
    }
  }

  onThumbnailLeave(): void {
    this.hoveredThumbnailIndex = null;
    const image = this.product.colors?.[this.selectedColorIndex]?.image;
    if (image) this.mainImage = image;
  }

  onThumbnailClick(index: number): void {
    this.mainImage = this.thumbnailImages[index];
    const colorIndex = this.product.colors.findIndex(
      (c) => c.image === this.thumbnailImages[index]
    );
    if (colorIndex !== undefined && colorIndex >= 0) {
      this.selectedColorIndex = colorIndex;
    }
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
    console.log('Adding to cart:', cartItem);
    this.cartService
      .addToCart(
        cartItem.productId,
        cartItem.selectedColor._id,
        cartItem.quantity
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Added to cart successfully');
          alert(
            `Added ${this.quantity} ${
              this.product.title
            } (${this.getSelectedColorName()}) to cart!`
          );
        },
        error: (err) => console.error('Failed to add to cart', err),
      });
  }

  addToWishlist(): void {
    console.log('Adding to wishlist:', this.product._id);
    alert(`Added ${this.product.title} to wishlist!`);
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
      alert('Product URL copied to clipboard!');
    }
  }
}
