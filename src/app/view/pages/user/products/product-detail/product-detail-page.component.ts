import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../../core/interfaces/product.interface';
import { ProductsService } from '../../../../../core/services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductInfoComponent } from './product-info/product-info.component';
import { RelatedProductComponent } from './related-product/related-product.component';
import { BreadcrumbComponent } from '../../../../../shared/breadcrump/breadcrump.component';
import { Status, StatusType } from '../../../../../core/util/status';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductInfoComponent,
    RelatedProductComponent,
    BreadcrumbComponent,
    LoaderComponent
  ],
  templateUrl: './product-detail-page.component.html',
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  product: Product | null = null;
  relatedProducts: Product[] = [];
  status = new Status();
  StatusType = StatusType;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params) => {
          const productId = params['id'];

          this.product = null;
          this.relatedProducts = [];
          this.status = new Status(StatusType.Loading);

          this.productService.getProductById(productId).subscribe({
            next: (product) => {
              this.product = product;
              this.status = new Status(StatusType.Success);
              this.loadRelatedProducts(product);
            },
            error: (err) => {
              console.error(err);
              this.status = new Status(StatusType.Error, 'Failed to load product details');
            }
          });
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

    this.productService
      .getRelatedProducts(categoryId, product._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.relatedProducts = products;
        },
        error: (err) => {
          console.error('Error loading related products:', err);
        },
      });
  }

 retryLoading(): void {
  const productId = this.route.snapshot.params['id'];

  this.product = null;
  this.relatedProducts = [];
  this.status = new Status(StatusType.Loading);

  this.productService.getProductById(productId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (product) => {
        this.product = product;
        this.status = new Status(StatusType.Success);
        this.loadRelatedProducts(product);
      },
      error: (err) => {
        console.error(err);
        this.status = new Status(StatusType.Error, 'Failed to load product details');
      }
    });
}



  getCategoryName(): string {
    return this.product?.category?.name || '';
  }
}
