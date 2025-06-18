import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Product } from '../../../../../core/interfaces/product.interface';
import { ProductsService } from '../../../../../core/services/products.service';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { ApiResponse } from '../../../../../core/interfaces/api-response.interface';
import { SearchInputComponent } from '../../../admin/components/search-input/search-input.component';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { BreadcrumbComponent } from '../../../../../shared/breadcrump/breadcrump.component';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, ProductFilterComponent, ProductGridComponent, SearchInputComponent, PaginationComponent, BreadcrumbComponent ],
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [];
  showNewArrivals: boolean = false;
  productsLoaded = false;
  filtersApplied = false;
  searchQuery: string = '';

  breadcrumbItems: { label: string; link?: string }[] = [];

  // Filters
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  priceRange: number[] = [0, 1500];

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesService,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.searchQuery = params['key'] || '';

      const categoryIdParam = params['categoryId'];
      this.selectedCategories = Array.isArray(categoryIdParam)
        ? categoryIdParam
        : categoryIdParam ? [categoryIdParam] : [];

      const colorIdParam = params['colorId'];
      this.selectedColors = Array.isArray(colorIdParam)
        ? colorIdParam
        : colorIdParam ? [colorIdParam] : [];

      this.priceRange = [
        +params['minPrice'] || 0,
        +params['maxPrice'] || 1500
      ];

      this.showNewArrivals = params['newArrivals'] === 'true';

      //  breadcrumbs
      if (this.selectedCategories.length === 1) {
        this.categoryService.getCategoryById(this.selectedCategories[0]).subscribe((res) => {
          const categoryName = res.data?.name || 'Category';
          this.breadcrumbItems = [
            { label: 'Home', link: '/' },
            { label: 'Products', link: '/products' },
            { label: categoryName, link: `/products?categoryId=${this.selectedCategories[0]}` }
          ];
        });
      } else {
        this.breadcrumbItems = [
          { label: 'Home', link: '/' },
          { label: 'Products' }
        ];
      }

      this.loadFilteredProducts();
    });
  }

  loadFilteredProducts(): void {
    this.productsLoaded = false;

    this.productService.getProducts({
      key: this.searchQuery,
      page: this.currentPage,
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1],
      categoryId: this.selectedCategories,
      colorId: this.selectedColors,
      sortBy: 'popularity',
    }).subscribe((res) => {
      this.products = res.success ? res.data : [];
      this.totalPages = res.totalPages ?? 1;
      this.productsLoaded = true;
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateUrlParams();
  }

  handleSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
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
    this.currentPage = 1;
    this.updateUrlParams();
  }

  private updateUrlParams(): void {
    const queryParams: any = {
      page: this.currentPage,
      key: this.searchQuery || undefined,
      categoryId: this.selectedCategories.length ? this.selectedCategories : undefined,
      colorId: this.selectedColors.length ? this.selectedColors : undefined,
      minPrice: this.priceRange[0],
      maxPrice: this.priceRange[1],
      newArrivals: this.showNewArrivals || undefined
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  resetFilters(): void {
  this.searchQuery = '';
  this.selectedCategories = [];
  this.selectedColors = [];
  this.priceRange = [0, 1500];
  this.showNewArrivals = false;
  this.currentPage = 1;
  this.filtersApplied = false;

  this.updateUrlParams(); 
}

}
