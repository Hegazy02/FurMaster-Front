import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../products/products/product-card/product-card.component';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';
import { DecorArticleComponent } from './components/Decor-Article/Decor-Article.component';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';
import { Product } from '../../../../core/interfaces/product.interface';
import AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    FeaturedCategoriesComponent,
    DecorArticleComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  productsService = inject(ProductsService);
  private destroy$ = new Subject<void>();
  productsResponse?: ApiResponse<Product[]>;
  getProducts() {
    this.productsService
      .getProducts({
        key: '',
        page: 1,
        limit: 4,
        sortBy: 'popularity',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.productsResponse = data;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  ngOnInit(): void {
    this.getProducts();
    AOS.init({});
  }
}
