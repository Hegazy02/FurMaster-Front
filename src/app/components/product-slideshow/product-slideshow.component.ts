import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/interfaces/product.interface';
import { ApiResponse } from '../../core/interfaces/api-response.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-slideshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-slideshow.component.html',
  styleUrls: ['./product-slideshow.component.css'],
})
export class ProductSlideshowComponent implements OnInit {
  products: Product[] = [];
  currentIndex = 0;

  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsService);

  ngOnInit(): void {
    this.productsService.getProducts({
      key: '',
      page: 1,
      limit: 5,
      sortBy: 'popularity',
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: ApiResponse<Product[]>) => {
        this.products = response.data ?? [];
        this.initSlider();
      },
      error: (err) => console.error('Slideshow product load failed:', err)
    });
  }

  initSlider(): void {
    setInterval(() => this.nextSlide(), 4000);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
  }
}
