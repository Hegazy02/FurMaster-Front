import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PrimaryFormInputComponent } from '../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component';
import { AuthService } from '../../../../core/services/auth.service';
import { PrimaryButtonComponent } from '../../../../shared/primary-button/primary-button.component';
import { Subject, takeUntil } from 'rxjs';
import { UserRole } from '../../../../core/interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimaryFormInputComponent,
    PrimaryButtonComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  formFields = [
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
    },
  ];

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    this.authService
      .login(loginData)
      .pipe(takeUntil(this.destroy$))

      .subscribe({
        next: (res) => {
          this.authService.user = res.data;
          this.authService.saveToken(res.token);
          this.navigateToPage(res.data.role);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed.';
        },
      });
  }
  isInvalid(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }
  navigateToPage(role: string) {
    if (role == UserRole.Admin) {
      this.router.navigate(['/admin']);
    }
    if (role == UserRole.User) {
      this.router.navigate(['/']);
    }
  }
  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
}
