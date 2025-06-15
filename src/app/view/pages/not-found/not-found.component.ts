import { Component, inject } from '@angular/core';
import { PrimaryButtonComponent } from '../../../shared/primary-button/primary-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [PrimaryButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  router = inject(Router);
  onClick() {
    this.router.navigate(['/']);
  }
}
