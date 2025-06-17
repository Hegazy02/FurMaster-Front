import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../core/interfaces/product.interface';
import { ProductsService } from '../../../../../core/services/products.service';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductGridComponent } from './product-grid/product-grid.component';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, ProductFilterComponent, ProductGridComponent],
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
})
export class ProductListingComponent {
  products: Product[] = [];
  showNewArrivals: boolean = false;
  productsLoaded = false;
  filtersApplied = false;


  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.productsLoaded = false;

    this.productService.getProducts({
      minPrice: 0,
      maxPrice: 1500,
    }).subscribe((res) => {
      this.products = res.success ? res.data : [];
      this.productsLoaded = true;
    });
  }

  handleFiltersChange(filters: {
    selectedCategories: string[];
    selectedColors: string[];
    priceRange: number[];
    showNewArrivals: boolean;
  }): void {
    this.showNewArrivals = filters.showNewArrivals;
    this.productsLoaded = false;
    this.filtersApplied = true;

    this.productService
      .getProducts({
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: '',
        categoryIds: filters.selectedCategories,
        colorIds: filters.selectedColors,
      })
      .subscribe((res) => {
        this.products = res.success ? res.data : [];
        this.productsLoaded = true; 
      });
  }

}

