import { Component, inject } from '@angular/core';
import { AccountDetailsFormInputComponent } from './account-details-form-input/account-details-form-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountDetailsService } from '../../../services/account-details.service';

@Component({
  selector: 'app-account-details-form',
  standalone: true,
  imports: [AccountDetailsFormInputComponent, ReactiveFormsModule],
  templateUrl: './account-details-form.component.html',
  styleUrl: './account-details-form.component.css',
})
export class AccountDetailsFormComponent {
  accountDetailsService = inject(AccountDetailsService);
}
