import { Component, inject } from '@angular/core';
import { AccountDetailsFormComponent } from './account-details-form/account-details-form.component';
import { AccountDetailsProfilePicComponent } from './account-details-profile-pic/account-details-profile-pic.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ErrorMessageComponent } from '../../../../../shared/error-message/error-message.component';
import { Observable } from 'rxjs/internal/Observable';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../../../core/services/user.service';

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
  spinner = inject(NgxSpinnerService);
  userService = inject(UserService);
  isError = false;
  file?: File;

  onImageSelected(file: File) {
    this.file = file;
  }

  onSubmit(accountDetailsForm: FormGroup) {
    this.spinner.show();
    this.isError = false;

    const update$ = this.updateUser(accountDetailsForm);

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
  updateUser(accountDetailsForm: FormGroup): Observable<any> | null {
    if (accountDetailsForm.valid) {
      const data: [string, any][] = this.splitUserData(accountDetailsForm);

      return this.userService.updateUser(data);
    } else {
      accountDetailsForm.markAllAsTouched();
      return null;
    }
  }

  private splitUserData(accountDetailsForm: FormGroup) {
    const data: [string, any][] = [
      ['firstName', accountDetailsForm.controls['firstName'].value],
      ['lastName', accountDetailsForm.controls['lastName'].value],
      ['gender', accountDetailsForm.controls['gender'].value],
      ['phoneNumber', accountDetailsForm.controls['phoneNumber'].value],
      ['city', accountDetailsForm.controls['city'].value],
      ['street', accountDetailsForm.controls['street'].value],
      ['address', accountDetailsForm.controls['address'].value],
    ];
    this.file && data.push(['image', this.file]);
    return data;
  }
}
