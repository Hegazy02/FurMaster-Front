import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AccountDetailsFormInputComponent } from './account-details-form-input/account-details-form-input.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../../../../core/services/user.service';
import { PrimaryButtonComponent } from '../../../../../../../shared/primary-button/primary-button.component';

@Component({
  selector: 'app-account-details-form',
  standalone: true,
  imports: [
    AccountDetailsFormInputComponent,
    ReactiveFormsModule,
    PrimaryButtonComponent,
  ],
  templateUrl: './account-details-form.component.html',
  styleUrl: './account-details-form.component.css',
})
export class AccountDetailsFormComponent {
  userService = inject(UserService);
  @Output() accountDetailsFormSubmit = new EventEmitter<FormGroup>();
  accountDetailsForm = new FormGroup({
    firstName: new FormControl(this.userService.user.firstName, [
      Validators.required,
    ]),
    lastName: new FormControl(this.userService.user.lastName, [
      Validators.required,
    ]),
    email: new FormControl({
      value: this.userService.user.email,
      disabled: true,
    }),
    gender: new FormControl(this.userService.user.gender),
    phoneNumber: new FormControl(this.userService.user.phoneNumber),
    city: new FormControl(this.userService.user.city),
    street: new FormControl(this.userService.user.street),
    address: new FormControl(this.userService.user.address),
  });

  isInvalid(control: AbstractControl): boolean {
    const data = control.invalid && control.touched;
    return data;
  }
  getFormControl(
    name:
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'gender'
      | 'phoneNumber'
      | 'city'
      | 'street'
      | 'address'
  ): FormControl {
    return this.accountDetailsForm.controls[name] as FormControl;
  }
  onSubmit() {
    this.accountDetailsFormSubmit.emit(this.accountDetailsForm);
  }
}
