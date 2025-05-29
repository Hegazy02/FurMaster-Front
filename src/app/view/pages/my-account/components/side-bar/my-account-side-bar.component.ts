import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-account-side-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-account-side-bar.component.html',
  styleUrl: './my-account-side-bar.component.css',
})
export class MyAccountSideBarComponent {
  sideBarContent = [
    { title: 'Orders', content: 'Orders content' },
    { title: 'Account-Details', content: 'Account Details content' },
    { title: 'Logout', content: 'Logout content' },
  ];
  selectedItem = 0;
  onClick(index: number) {
    this.selectedItem = index;
    console.log(this.selectedItem);
    
  }
}
