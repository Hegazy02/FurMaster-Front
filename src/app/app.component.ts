<<<<<<< HEAD
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';
=======
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
>>>>>>> c77ee60 (making the first step of the homepage)

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
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
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
=======
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Decor Store';
>>>>>>> c77ee60 (making the first step of the homepage)
}
