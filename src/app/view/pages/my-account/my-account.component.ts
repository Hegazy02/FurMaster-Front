import { Component } from '@angular/core';
import { MyAccountSideBarComponent } from './components/side-bar/my-account-side-bar.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [MyAccountSideBarComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {

}
