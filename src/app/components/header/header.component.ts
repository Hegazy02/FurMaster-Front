import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule,CommonModule]
})
export class HeaderComponent {


  cartItemCount = 0;

constructor(private cartService: CartService) {}

ngOnInit() {
  this.cartService.getCartItemCount().subscribe(count => {
    this.cartItemCount = count;
  });

  this.cartService.init().subscribe(items => {
    this.cartService.cartItemsSubject.next(items);
  });
}

  // Add any header-specific logic here
} 