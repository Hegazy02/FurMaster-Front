import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { PrimaryFormInputComponent } from '../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component';
import { Router, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from '../../../../shared/primary-button/primary-button.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PrimaryFormInputComponent,
    PrimaryButtonComponent,
  ],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private destroy$ = new Subject<void>();
  get formControls() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    const email = this.forgotForm.value.email;
    this.authService
      .forgetPassword(email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/reset-password'], {
            state: {
              email: email,
              otp: res.otp,
              lastTwoNumbersOfPhoneNumber: res.lastTwoNumbersOfPhoneNumber,
            },
          });
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
