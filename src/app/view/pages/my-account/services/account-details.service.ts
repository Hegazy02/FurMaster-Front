import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Endpoints } from '../../../../core/constants/endpoints';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../../../core/interfaces/user.interface';
@Injectable({
  providedIn: 'root',
})
export class AccountDetailsService {
  http = inject(HttpClient);
  user: User = {
    id: '1',
    firstName: 'Abdo',
    lastName: 'Hegazy',
    email: 'Hegazy@gmail.com',
    gender: 1,
    phoneNumber: '0123456789',
    city: 'cairo',
    street: 'street',
    address: 'address',
    image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  };
  accountDetailsForm = new FormGroup({
    firstName: new FormControl(this.user.firstName, [Validators.required]),
    lastName: new FormControl(this.user.lastName, [Validators.required]),
    email: new FormControl({ value: this.user.email, disabled: true }),
    gender: new FormControl(this.user.gender),
    phoneNumber: new FormControl(this.user.phoneNumber),
    city: new FormControl(this.user.city),
    street: new FormControl(this.user.street),
    address: new FormControl(this.user.address),
  });
  file?: File;
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
  //api calls
  updateUser(): Observable<any> | null {
    if (this.accountDetailsForm.valid) {
      const formData = new FormData();
      this.appendData(formData);

      return this.http.patch(Endpoints.USER, formData);
    } else {
      this.accountDetailsForm.markAllAsTouched();
      return null;
    }
  }
  private appendData(formData: FormData) {
    this.file && formData.append('image', this.file);
    formData.append('firstName', this.getFormControl('firstName').value);
    formData.append('lastName', this.getFormControl('lastName').value);
    formData.append('gender', this.getFormControl('gender').value);
    formData.append('phoneNumber', this.getFormControl('phoneNumber').value);
    formData.append('city', this.getFormControl('city').value);
    formData.append('street', this.getFormControl('street').value);
    formData.append('address', this.getFormControl('address').value);
  }
  isInvalid(control: AbstractControl): boolean {
    const data = control.invalid && control.touched;
    return data;
  }
}
