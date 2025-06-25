import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Status, StatusType } from '../../../../../core/util/status';
import { Product } from '../../../../../core/interfaces/product.interface';
import { ProductsService } from '../../../../../core/services/products.service';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { SearchInputComponent } from '../../../../../shared/search-input/search-input.component';
import { BreadcrumbComponent } from '../../../../../shared/breadcrump/breadcrump.component';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BannerComponent } from '../../../../../shared/banner/banner.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [
    CommonModule,
    ProductFilterComponent,
    ProductGridComponent,
    SearchInputComponent,
    MatPaginatorModule,
    BreadcrumbComponent,
    LoaderComponent,
    BannerComponent,
  ],
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
})
export class ProductListingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: Product[] = [];
  showNewArrivals: boolean = false;
  StatusType = StatusType;
  productsStatus = new Status();
  filtersApplied = false;
  searchQuery: string = '';

  categoryImage?: string;
  categoryName?: string;
  categoryLoaded = false;

  breadcrumbItems: { label: string; link?: string }[] = [];

  ///////Filters
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  priceRange: number[] = [0, 1500];

  ///////Pagination
  limit = 10;
  page = 1;
  totalItems = 0;
  categoryIdParam = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.page = +params['page'] || 1;
        this.searchQuery = params['key'] || '';

        this.categoryIdParam = params['categoryId'];
        this.selectedCategories = [this.categoryIdParam];

        const colorIdParam = params['colorId'];
        this.selectedColors = Array.isArray(colorIdParam)
          ? colorIdParam
          : colorIdParam
          ? [colorIdParam]
          : [];

        this.priceRange = [
          +params['minPrice'] || 0,
          +params['maxPrice'] || 1500,
        ];
        this.showNewArrivals = params['newArrivals'] === 'true';

        ///// Breadcrumbs
        if (this.selectedCategories.length === 1) {
          this.categoryLoaded = false;
          this.categoryService
            .getCategoryById(this.selectedCategories[0])
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res) => {
                const category = res?.data;
                if (category) {
                  this.categoryName = category.name || 'Category';
                  this.categoryImage =
                    category.image || 'assets/images/default-banner.jpg';
                  this.breadcrumbItems = [
                    { label: 'Home', link: '/' },
                    { label: 'Products', link: '/products' },
                    { label: this.categoryName },
                  ];
                } else {
                  this.breadcrumbItems = [
                    { label: 'Home', link: '/' },
                    { label: 'Products' },
                  ];
                }
                this.categoryLoaded = true;
              },
              error: () => {
                this.breadcrumbItems = [
                  { label: 'Home', link: '/' },
                  { label: 'Products' },
                ];
                this.categoryLoaded = true;
              },
            });
        } else {
          this.categoryName = '';
          this.categoryImage = '';
          this.categoryLoaded = true;
          this.breadcrumbItems = [
            { label: 'Home', link: '/' },
            { label: 'Products' },
          ];
        }
        this.loadFilteredProducts();
      });
  }

  loadFilteredProducts(): void {
    this.productsStatus = new Status(StatusType.Loading);

    this.productService
      .getProducts({
        key: this.searchQuery,
        page: this.page,
        minPrice: this.priceRange[0],
        maxPrice: this.priceRange[1],
        categoryId: this.selectedCategories,
        colorId: this.selectedColors,
        sortBy: 'popularity',
        limit: this.limit,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.products = res.success ? res.data : [];
          this.totalItems = res.total ?? 0;
          this.productsStatus = new Status(StatusType.Success);
        },
        error: (err) => {
          console.error('Error loading products', err);
          this.productsStatus = new Status(
            StatusType.Error,
            'Failed to load products'
          );
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.updateUrlParams();
  }

  handleSearchChange(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.updateUrlParams();
  }

  handleFiltersChange(filters: {
    selectedCategories: string[];
    selectedColors: string[];
    priceRange: number[];
    showNewArrivals: boolean;
  }): void {
    this.selectedCategories = filters.selectedCategories;
    this.selectedColors = filters.selectedColors;
    this.priceRange = filters.priceRange;
    this.showNewArrivals = filters.showNewArrivals;
    this.filtersApplied = true;
    this.page = 1;
    this.updateUrlParams();
  }

  updateUrlParams(): void {
    const currentParams = { ...this.route.snapshot.queryParams };

    const newParams: any = {
      page: this.page,
      limit: this.limit,
      key: this.searchQuery || undefined,
      categoryId: this.selectedCategories.length
        ? this.selectedCategories
        : undefined,
      colorId: this.selectedColors.length ? this.selectedColors : undefined,
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1],
      newArrivals: this.showNewArrivals || undefined,
    };

    const mergedParams = { ...currentParams, ...newParams };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: mergedParams,
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.selectedColors = [];
    this.priceRange = [0, 1500];
    this.showNewArrivals = false;
    this.page = 1;
    this.filtersApplied = false;
    this.updateUrlParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
