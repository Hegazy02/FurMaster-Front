import { Component } from '@angular/core';
import { SideBarComponent } from "./components/side-bar/side-bar.component";

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [SideBarComponent],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {

}
