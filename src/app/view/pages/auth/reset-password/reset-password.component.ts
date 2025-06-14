import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { PrimaryFormInputComponent } from "../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AuthService } from "../../../../core/services/auth.service";

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
  ],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  maskedPhone = '';
  email = '';
  otp = '';
  phone = ''; // لو بدك تستعمله
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
    this.phone = state?.phone || '';
    this.maskedPhone = state?.maskedPhone || '';

    this.resetForm = this.fb.group({
      userOtp: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get formControls() {
    return this.resetForm.controls;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    const { userOtp, password } = this.resetForm.value;

    this.authService.resetPassword({
      email: this.email,
      otp: this.otp,
      userOtp,
      password,
    }).subscribe({
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
}
