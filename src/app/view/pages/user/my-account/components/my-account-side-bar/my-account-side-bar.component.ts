import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account-side-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-account-side-bar.component.html',
  styleUrl: './my-account-side-bar.component.css',
})
export class MyAccountSideBarComponent {
  router = inject(Router);
  sideBarContent = [
    { title: 'Orders', route: '/my-account/orders' },
    { title: 'Account Details', route: '/my-account/account-details' },
    { title: 'Payment Methods', route: '/my-account/payment-methods' },
    { title: 'Logout', route: '/' },
  ];
  selectedItem = 1;
  onClick(index: number) {
    this.selectedItem = index;
    console.log(this.selectedItem);
    this.router.navigate([this.sideBarContent[index].route]);
  }
}
