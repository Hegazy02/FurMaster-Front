import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';
import { UserRole } from './core/interfaces/user.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private loadingSub!: Subscription;
  loadingService = inject(LoadingService);
  spinner = inject(NgxSpinnerService);
  authService = inject(AuthService);
  router = inject(Router);
  ngOnInit(): void {
    this.loadingSub = this.loadingService.loading$.subscribe((isLoading) => {
      isLoading ? this.spinner.show() : this.spinner.hide();
    });
    this.getUser();
  }
  getUser() {
    return this.authService.getUser().subscribe({
      next: (user) => {
        this.authService.user = user;
        if (user.role === UserRole.Admin) {
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }
  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
