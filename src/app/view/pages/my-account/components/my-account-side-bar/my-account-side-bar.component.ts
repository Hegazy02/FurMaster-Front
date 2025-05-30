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
  sideBarContent = ['Orders', 'Account-Details', 'Logout'];
  selectedItem = 1;
  onClick(index: number) {
    this.selectedItem = index;
    console.log(this.selectedItem);
  }
}
