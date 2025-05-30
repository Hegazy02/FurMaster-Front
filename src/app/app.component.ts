import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyAccountComponent } from './view/pages/my-account/my-account.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyAccountComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'furmaster';
}
