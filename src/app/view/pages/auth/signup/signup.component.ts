import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PrimaryFormInputComponent } from '../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component';
import { AuthService } from '../../../../core/services/auth.service';
import { SignupBody } from '../../../../core/interfaces/auth.interface';
import { PrimaryButtonComponent } from '../../../../shared/primary-button/primary-button.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimaryFormInputComponent,
    RouterLink,
    PrimaryButtonComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z][A-Za-z0-9]{2,}')],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern('[A-Za-z][A-Za-z0-9]{2,}')],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const signupData: SignupBody = this.signupForm.value;
    this.authService.signup(signupData).subscribe({
      next: (res) => {
        this.authService.saveToken(res.data);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Signup failed.';
      },
    });
  }

  get formControls() {
    return this.signupForm.controls;
  }

  formFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
    },

    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      error:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter your phone number',
      error: 'Please enter a valid phone number.',
    },
  ];
  isInvalid(control: AbstractControl): boolean {
    const data = control.invalid && control.touched;
    console.log('control', control.errors);

    return data;
  }
}
