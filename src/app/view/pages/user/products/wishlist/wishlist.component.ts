import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { WishlistService } from '../../../../../core/services/wishlist.service';
import { Product } from '../../../../../core/interfaces/product.interface';
import { Status, StatusType } from '../../../../../core/util/status';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoaderComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistProducts: Product[] = [];
  wishlistStatus = new Status();
  StatusType = StatusType;

  private destroy$ = new Subject<void>();

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistStatus = new Status(StatusType.Loading);

    this.wishlistService.getWishlist()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.wishlistProducts = res.data || [];
          this.wishlistStatus = new Status(StatusType.Success);
        },
        error: () => {
          this.wishlistStatus = new Status(StatusType.Error, 'Failed to load wishlist');
        }
      });
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.wishlistProducts = this.wishlistProducts.filter(p => p._id !== productId);
        },
        error: () => {
          console.error('Failed to remove product from wishlist');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
