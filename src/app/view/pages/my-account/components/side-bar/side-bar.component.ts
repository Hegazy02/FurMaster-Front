import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
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
