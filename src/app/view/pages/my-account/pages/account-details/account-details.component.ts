import { Component, inject } from '@angular/core';
import { AccountDetailsFormComponent } from './account-details-form/account-details-form.component';
import { AccountDetailsService } from '../../services/account-details.service';
import { AccountDetailsProfilePicComponent } from './account-details-profile-pic/account-details-profile-pic.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ErrorMessageComponent } from '../../../../../shared/error-message/error-message.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [
    AccountDetailsFormComponent,
    AccountDetailsProfilePicComponent,
    NgxSpinnerModule,
    ErrorMessageComponent,
  ],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css',
})
export class AccountDetailsComponent {
  accountDetailsService = inject(AccountDetailsService);
  spinner = inject(NgxSpinnerService);
  isError = false;

  onSubmit() {
    this.spinner.show();
    this.isError = false;

    const update$ = this.accountDetailsService.updateUser();

    if (!update$) {
      this.spinner.hide();
      return;
    }

    update$.subscribe({
      next: () => {
        this.spinner.hide();
        this.isError = false;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error updating user:', err);
        this.isError = true;
      },
    });
  }
}
