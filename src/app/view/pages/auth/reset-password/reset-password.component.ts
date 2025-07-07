import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PrimaryFormInputComponent } from '../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { PrimaryButtonComponent } from '../../../../shared/primary-button/primary-button.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    PrimaryFormInputComponent,
    CommonModule,
    PrimaryButtonComponent,
  ],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  lastTwoNumbersOfPhoneNumber = '';
  email = '';
  otp = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;

    this.email = state?.email || '';
    this.otp = state?.otp || '';
    this.lastTwoNumbersOfPhoneNumber = state?.lastTwoNumbersOfPhoneNumber || '';

    this.resetForm = this.fb.group({
      userOtp: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
          ),
        ],
      ],
    });
  }

  private destroy$ = new Subject<void>();

  get formControls() {
    return this.resetForm.controls;
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { userOtp, password } = this.resetForm.value;

    this.authService
      .resetPassword({
        email: this.email,
        otp: this.otp.toString(),
        userOtp,
        password,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Something went wrong';
          this.successMessage = '';
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
