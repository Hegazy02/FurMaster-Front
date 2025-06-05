import { Component } from '@angular/core';
import { MyAccountSideBarComponent } from './components/my-account-side-bar/my-account-side-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [MyAccountSideBarComponent, RouterOutlet],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class MyAccountComponent {}
