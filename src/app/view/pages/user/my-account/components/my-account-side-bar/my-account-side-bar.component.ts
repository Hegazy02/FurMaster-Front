import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';

@Component({
  selector: 'app-my-account-side-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-account-side-bar.component.html',
  styleUrl: './my-account-side-bar.component.css',
})
export class MyAccountSideBarComponent {
  router = inject(Router);
  authService = inject(AuthService);
  sideBarContent = [
    { title: 'Orders', route: '/my-account/orders' },
    { title: 'Account Details', route: '/my-account/account-details' },
    { title: 'Payment Methods', route: '/my-account/payment-methods' },
    { title: 'Logout', route: '/' },
  ];
  selectedItem = 1;
  onClick(index: number) {
    this.selectedItem = index;
    if (this.sideBarContent[index].route === '/') {
      this.authService.logout();
    }
    this.router.navigate([this.sideBarContent[index].route]);
  }
}
