import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../../core/services/auth.service';

@Component({
  selector: 'app-my-account-side-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-account-side-bar.component.html',
  styleUrl: './my-account-side-bar.component.css',
})
export class MyAccountSideBarComponent implements OnInit {
  ngOnInit(): void {
    this.getSelectedItem();
  }
  router = inject(Router);
  authService = inject(AuthService);
  sideBarContent = [
    { title: 'Orders', route: '/my-account/orders' },
    { title: 'Account Details', route: '/my-account/account-details' },
    { title: 'Payment Methods', route: '/my-account/payment-methods' },
    { title: 'Logout', route: '/' },
  ];
  selectedItem = 0;

  onClick(index: number) {
    this.selectedItem = index;
    if (this.sideBarContent[index].route === '/') {
      this.authService.logout();
    }
    this.router.navigate([this.sideBarContent[index].route]);
  }
  private getSelectedItem() {
    for (let i = 0; i < this.sideBarContent.length; i++) {
      const element = this.sideBarContent[i];
      const isActive = this.router.url.includes(element.route);
      if (isActive) {
        this.selectedItem = i;
        return;
      }
    }
  }
}
