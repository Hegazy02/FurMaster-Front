import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PrimaryFormInputComponent } from './primary-form-input/primary-form-input.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../../../../shared/primary-button/primary-button.component';
import { AuthService } from '../../../../../../../core/services/auth.service';

@Component({
  selector: 'app-account-details-form',
  standalone: true,
  imports: [
    PrimaryFormInputComponent,
    ReactiveFormsModule,
    PrimaryButtonComponent,
  ],
  templateUrl: './account-details-form.component.html',
  styleUrl: './account-details-form.component.css',
})
export class AccountDetailsFormComponent {
  authService = inject(AuthService);
  @Output() accountDetailsFormSubmit = new EventEmitter<FormGroup>();
  accountDetailsForm = new FormGroup({
    firstName: new FormControl(this.authService.user!.firstName, [
      Validators.required,
      Validators.pattern('[A-Za-z][A-Za-z0-9]{2,}'),
    ]),
    lastName: new FormControl(this.authService.user!.lastName, [
      Validators.required,
      Validators.pattern('[A-Za-z][A-Za-z0-9]{2,}'),
    ]),
    email: new FormControl({
      value: this.authService.user!.email,
      disabled: true,
    }),
    gender: new FormControl(this.authService.user!.gender),
    phoneNumber: new FormControl(this.authService.user!.phoneNumber, [
      Validators.required,
      Validators.pattern('[0-9]{11}'),
    ]),
    city: new FormControl(this.authService.user!.city),
    street: new FormControl(this.authService.user!.street),
    address: new FormControl(this.authService.user!.address),
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
