import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../../../../core/services/wishlist.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class HeaderComponent {


  cartItemCount = 0;
  wishlistItemCount = 0;
  isMobileMenuOpen = false;
  constructor(private cartService: CartService, private wishlistService: WishlistService) { }

  ngOnInit() {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });

    this.cartService.init().subscribe(items => {
      this.cartService.cartItemsSubject.next(items);
    });
    this.wishlistService.getWishlistItemCount().subscribe(count => {
      this.wishlistItemCount = count;
    });
    this.wishlistService.init().subscribe(res => {
      if (res.success) {
        this.wishlistService.updateWishlistItems(res.data);
      }
    });
  }

  toggleMobileMenu(): void {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

closeMobileMenu(): void {
  this.isMobileMenuOpen = false;
}
}

