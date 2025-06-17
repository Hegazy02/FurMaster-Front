import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  colors: string[];
  category: string;
  isNewArrival: boolean;
  dateAdded: string;
}

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Filters Sidebar -->
          <div class="lg:w-80 space-y-6">
            <div class="bg-white rounded-lg p-6 shadow-sm">
              <h2 class="text-xl font-semibold mb-6">Filters</h2>

              <!-- Categories -->
              <div class="mb-6">
                <button 
                  (click)="categoryOpen = !categoryOpen"
                  class="flex items-center justify-between w-full py-2 text-left font-medium"
                >
                  Categories
                  <svg class="w-4 h-4" [class.rotate-180]="categoryOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div *ngIf="categoryOpen" class="space-y-3 pt-3">
                  <div *ngFor="let category of categories" class="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      [id]="category"
                      [checked]="selectedCategories.includes(category)"
                      (change)="handleCategoryChange(category, $event)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label [for]="category" class="text-sm font-normal cursor-pointer">
                      {{ category }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Colors -->
              <div class="mb-6 border-t pt-4">
                <button 
                  (click)="colorOpen = !colorOpen"
                  class="flex items-center justify-between w-full py-2 text-left font-medium"
                >
                  Colors
                  <svg class="w-4 h-4" [class.rotate-180]="colorOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div *ngIf="colorOpen" class="space-y-3 pt-3">
                  <div *ngFor="let color of colorOptions" class="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      [id]="color.value"
                      [checked]="selectedColors.includes(color.value)"
                      (change)="handleColorChange(color.value, $event)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div
                      class="w-4 h-4 rounded-full border border-gray-300"
                      [style.backgroundColor]="color.value"
                    ></div>
                    <label [for]="color.value" class="text-sm font-normal cursor-pointer">
                      {{ color.name }}
                    </label>
                  </div>
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-6 border-t pt-4">
                <button 
                  (click)="priceOpen = !priceOpen"
                  class="flex items-center justify-between w-full py-2 text-left font-medium"
                >
                  Price Range
                  <svg class="w-4 h-4" [class.rotate-180]="priceOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div *ngIf="priceOpen" class="pt-3">
                  <div class="space-y-4">
                    <input 
                      type="range" 
                      [min]="0" 
                      [max]="1500" 
                      [step]="50"
                      [(ngModel)]="priceRange[0]"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input 
                      type="range" 
                      [min]="0" 
                      [max]="1500" 
                      [step]="50"
                      [(ngModel)]="priceRange[1]"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div class="flex justify-between text-sm text-gray-600">
                      <span>\${{ priceRange[0] }}</span>
                      <span>\${{ priceRange[1] }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- New Arrivals -->
              <div class="border-t pt-4">
                <button 
                  (click)="newArrivalsOpen = !newArrivalsOpen"
                  class="flex items-center justify-between w-full py-2 text-left font-medium"
                >
                  New Arrivals
                  <svg class="w-4 h-4" [class.rotate-180]="newArrivalsOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div *ngIf="newArrivalsOpen" class="pt-3">
                  <div class="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="new-arrivals"
                      [(ngModel)]="showNewArrivals"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label for="new-arrivals" class="text-sm font-normal cursor-pointer">
                      Show only new arrivals
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div class="flex-1">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Living Room Furniture</h1>
                <p class="text-gray-600 mt-1">{{ filteredProducts.length }} products found</p>
              </div>
              <select 
                [(ngModel)]="sortBy"
                class="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                *ngFor="let product of filteredProducts"
                class="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
                (mouseenter)="hoveredProduct = product.id"
                (mouseleave)="hoveredProduct = null"
              >
                <div class="relative overflow-hidden">
                  <img
                    [src]="product.image"
                    [alt]="product.name"
                    class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span 
                    *ngIf="product.isNewArrival"
                    class="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded"
                  >
                    New
                  </span>
                  <span 
                    *ngIf="product.discountedPrice"
                    class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded"
                  >
                    Sale
                  </span>
                  <div 
                    *ngIf="hoveredProduct === product.id"
                    class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                  >
                    <button class="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md font-medium flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Quick View
                    </button>
                  </div>
                </div>

                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>

                  <div class="flex items-center mb-2">
                    <div class="flex items-center">
                      <svg 
                        *ngFor="let star of getStarArray(product.rating); let i = index"
                        class="w-4 h-4"
                        [class]="getStarClass(i, product.rating)"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                    <span class="text-sm text-gray-500 ml-2">({{ product.reviewCount }})</span>
                  </div>

                  <div class="flex items-center space-x-2 mb-3">
                    <div 
                      *ngFor="let color of product.colors"
                      class="w-6 h-6 rounded-full border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                      [style.backgroundColor]="color"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span 
                        *ngIf="product.discountedPrice; else originalPrice"
                        class="text-lg font-bold text-gray-900"
                      >
                        \${{ product.discountedPrice }}
                      </span>
                      <span 
                        *ngIf="product.discountedPrice"
                        class="text-sm text-gray-500 line-through"
                      >
                        \${{ product.originalPrice }}
                      </span>
                      <ng-template #originalPrice>
                        <span class="text-lg font-bold text-gray-900">\${{ product.originalPrice }}</span>
                      </ng-template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Products Found -->
            <div *ngIf="filteredProducts.length === 0" class="text-center py-12">
              <p class="text-gray-500 text-lg">No products found matching your filters.</p>
              <button
                (click)="clearAllFilters()"
                class="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class ProductListingComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: "Modern Velvet Sofa",
      originalPrice: 1299,
      discountedPrice: 999,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      rating: 4.5,
      reviewCount: 128,
      colors: ["#2D3748", "#E53E3E", "#38A169"],
      category: "Sofas",
      isNewArrival: true,
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      name: "Scandinavian Coffee Table",
      originalPrice: 449,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
      rating: 4.8,
      reviewCount: 89,
      colors: ["#F7FAFC", "#2D3748"],
      category: "Tables",
      isNewArrival: false,
      dateAdded: "2023-12-10",
    },
    {
      id: 3,
      name: "Luxury Armchair",
      originalPrice: 899,
      discountedPrice: 699,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
      rating: 4.3,
      reviewCount: 67,
      colors: ["#2D3748", "#744210", "#E53E3E"],
      category: "Chairs",
      isNewArrival: true,
      dateAdded: "2024-01-20",
    },
    {
      id: 4,
      name: "Minimalist Bookshelf",
      originalPrice: 329,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
      rating: 4.6,
      reviewCount: 45,
      colors: ["#F7FAFC", "#2D3748"],
      category: "Storage",
      isNewArrival: false,
      dateAdded: "2023-11-05",
    },
    {
      id: 5,
      name: "Designer Floor Lamp",
      originalPrice: 199,
      discountedPrice: 149,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
      rating: 4.4,
      reviewCount: 92,
      colors: ["#2D3748", "#F7FAFC", "#E53E3E"],
      category: "Lighting",
      isNewArrival: true,
      dateAdded: "2024-01-25",
    },
    {
      id: 6,
      name: "Rustic Dining Table",
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 156,
      colors: ["#744210", "#2D3748"],
      category: "Tables",
      isNewArrival: false,
      dateAdded: "2023-10-15",
    },
  ];

  categories = ["Sofas", "Tables", "Chairs", "Storage", "Lighting"];
  colorOptions = [
    { name: "Black", value: "#2D3748" },
    { name: "White", value: "#F7FAFC" },
    { name: "Red", value: "#E53E3E" },
    { name: "Green", value: "#38A169" },
    { name: "Brown", value: "#744210" },
  ];

  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  priceRange = [0, 1500];
  sortBy = "newest";
  showNewArrivals = false;
  hoveredProduct: number | null = null;

  // Collapsible states
  categoryOpen = true;
  colorOpen = true;
  priceOpen = true;
  newArrivalsOpen = true;

  filteredProducts: Product[] = [];

  ngOnInit() {
    this.updateFilteredProducts();
  }

  handleCategoryChange(category: string, event: any) {
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.updateFilteredProducts();
  }

  handleColorChange(color: string, event: any) {
    if (event.target.checked) {
      this.selectedColors.push(color);
    } else {
      this.selectedColors = this.selectedColors.filter(c => c !== color);
    }
    this.updateFilteredProducts();
  }

  updateFilteredProducts() {
    this.filteredProducts = this.products
      .filter(product => {
        // Category filter
        if (this.selectedCategories.length > 0 && !this.selectedCategories.includes(product.category)) {
          return false;
        }

        // Color filter
        if (this.selectedColors.length > 0 && !product.colors.some(color => this.selectedColors.includes(color))) {
          return false;
        }

        // Price filter
        const price = product.discountedPrice || product.originalPrice;
        if (price < this.priceRange[0] || price > this.priceRange[1]) {
          return false;
        }

        // New arrivals filter
        if (this.showNewArrivals && !product.isNewArrival) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return (a.discountedPrice || a.originalPrice) - (b.discountedPrice || b.originalPrice);
          case 'price-high':
            return (b.discountedPrice || b.originalPrice) - (a.discountedPrice || a.originalPrice);
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
          default:
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
      });
  }

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  getStarClass(index: number, rating: number): string {
    if (index < Math.floor(rating)) {
      return 'text-yellow-400';
    } else if (index < rating) {
      return 'text-yellow-400 opacity-50';
    } else {
      return 'text-gray-300';
    }
  }

  clearAllFilters() {
    this.selectedCategories = [];
    this.selectedColors = [];
    this.priceRange = [0, 1500];
    this.showNewArrivals = false;
    this.updateFilteredProducts();
  }
}