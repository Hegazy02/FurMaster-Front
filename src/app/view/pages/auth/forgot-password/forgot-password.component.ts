import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { PrimaryFormInputComponent } from '../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimaryFormInputComponent],
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

  get formControls() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    const email = this.forgotForm.value.email;

    this.authService.forgetPassword(email).subscribe({
      next: (res) => {
        console.log(res)
        // التنقل لصفحة reset-password مع البيانات المطلوبة
        this.router.navigate(['/reset-password'], {
          state: {
            email: res.email,
            otp: res.otp,
            phone: res.phone,
            maskedPhone: res.maskedPhone,
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Something went wrong';
        this.successMessage = '';
      },
    });
  }
}
