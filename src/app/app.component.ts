import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSpinnerComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
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
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }
  getCurrentRoute() {
    return this.router.url;
  }
  showHeaderAndFooter(): boolean {
    return (
      this.router.url !== '/login' &&
      this.router.url !== '/signup' &&
      this.router.url !== '/reset-password' &&
      this.router.url !== '/forgot-password'
    );
  }
}
