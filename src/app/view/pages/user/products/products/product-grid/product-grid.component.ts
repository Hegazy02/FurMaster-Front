import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../../core/interfaces/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CartService } from '../../../../../../core/services/cart.service';
import { WishlistService } from '../../../../../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'scale(0.95)' }),
            stagger('300ms', animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })))
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class ProductGridComponent implements OnChanges {
  @Input() products: Product[] = [];
  @Input() showNewArrivals: boolean = false;

  sortBy: string = 'newest';
  hoveredProduct: string | null = null;
  sortedProducts: Product[] = [];

  @Output() sortChanged = new EventEmitter<string>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] || changes['showNewArrivals']) {
      this.applySortingAndFiltering();
    }
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value;
    this.sortChanged.emit(this.sortBy);
    this.applySortingAndFiltering();
  }

  applySortingAndFiltering(): void {
    let filtered = [...this.products];

    if (this.showNewArrivals) {
      filtered = filtered.filter((product) => this.isNewArrival(product.createdAt));
    }

    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratingCounter - a.ratingCounter);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    this.sortedProducts = filtered;
  }

  isNewArrival(date: Date): boolean {
    const addedDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = (currentDate.getTime() - addedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30;
  }

handleAddToWishlist(product: Product) {
  this.wishlistService.addToWishlist(product._id).subscribe({
    next: () => {
      this.toastr.success('Product added to wishlist');
    },
    error: () => {
      this.toastr.error('Failed to add product to wishlist');
    }
  });
}

handleRemoveFromWishlist(productId: string) {
  this.wishlistService.removeFromWishlist(productId).subscribe({
    next: () => {
      this.toastr.info('Product removed from wishlist');
    },
    error: () => {
      this.toastr.error('Failed to remove product from wishlist');
    }
  });
}



}
