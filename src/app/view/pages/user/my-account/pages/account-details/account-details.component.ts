import { Component, inject } from '@angular/core';
import { AccountDetailsFormComponent } from './account-details-form/account-details-form.component';
import { AccountDetailsProfilePicComponent } from './account-details-profile-pic/account-details-profile-pic.component';
import { Observable } from 'rxjs/internal/Observable';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../../../core/interfaces/user.interface';
import { AuthService } from '../../../../../../core/services/auth.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [AccountDetailsFormComponent, AccountDetailsProfilePicComponent],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css',
})
export class AccountDetailsComponent {
  toastr = inject(ToastrService);
  userService = inject(UserService);
  authService = inject(AuthService);
  file?: File;

  onImageSelected(file: File) {
    this.file = file;
  }

  onSubmit(accountDetailsForm: FormGroup) {
    this.updateUser(accountDetailsForm)?.subscribe({
      next: (data) => {
        console.log('data', data);
        this.authService.user = data;
        this.toastr.success('User updated successfully.');
      },
      error: (err) => {
        this.toastr.error('Could not update user.');
      },
    });
  }
  updateUser(accountDetailsForm: FormGroup): Observable<User> | null {
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
