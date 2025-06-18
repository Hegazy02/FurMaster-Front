import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../../core/interfaces/product.interface';
import { ProductsService } from '../../../../../core/services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductInfoComponent } from './product-info/product-info.component';
import { RelatedProductComponent } from './related-product/related-product.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductInfoComponent,
    RelatedProductComponent
  ],
  templateUrl: './product-detail-page.component.html'
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params) => {
          const productId = params['id'];

          // Reset state before loading
          this.product = null;
          this.relatedProducts = [];
          this.loading = true;
          this.error = null;

          this.productService.getProductById(productId).subscribe({
            next: (product) => {
              this.product = product;
              this.loading = false;
              this.loadRelatedProducts(product);
            },
            error: (err) => {
              console.error(err);
              this.loading = false;
              this.error = 'Failed to load product details';
            }
          });
        },
        error: () => {
          this.loading = false;
          this.error = 'Error loading data';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRelatedProducts(product: Product): void {
    const categoryId = product.category?._id;
    if (!categoryId) return;

    this.productService.getRelatedProducts(categoryId, product._id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }

  retryLoading(): void {
    const productId = this.route.snapshot.params['id'];

    this.product = null;
    this.relatedProducts = [];
    this.loading = true;
    this.error = null;

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.loadRelatedProducts(product);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Failed to load product details';
      }
    });
  }

  getCategoryName(): string {
    return this.product?.category?.name || '';
  }
}
