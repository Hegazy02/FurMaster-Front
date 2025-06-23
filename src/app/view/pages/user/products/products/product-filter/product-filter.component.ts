import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../../../../core/services/products.service';
import { Category } from '../../../../../../core/interfaces/category.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.component.html',
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories: Category[] = [];
  colorOptions: { name: string; hex?: string; id: string }[] = [];

  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  priceRange: number[] = [0, 1500];
  showNewArrivals: boolean = false;

  categoryOpen = true;
  colorOpen = true;
  priceOpen = true;
  newArrivalsOpen = true;

  @Output() filtersChanged = new EventEmitter<{
    selectedCategories: string[];
    selectedColors: string[];
    priceRange: number[];
    showNewArrivals: boolean;
  }>();

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchColors();
  }

  fetchCategories(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.success) this.categories = res.data;
      });
  }

  fetchColors(): void {
    this.productService.getColors()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.success) {
          this.colorOptions = res.data.map((c) => ({
            id: c._id,
            name: c.name,
            hex: c.hex,
          }));
        }
      });
  }

  emitChanges(): void {
    this.filtersChanged.emit({
      selectedCategories: this.selectedCategories,
      selectedColors: this.selectedColors,
      priceRange: this.priceRange,
      showNewArrivals: this.showNewArrivals,
    });
  }

  handleCategoryChange(categoryId: string) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
    this.emitChanges();
  }

  handleColorChange(id: string, event?: any): void {
    if (this.selectedColors.includes(id)) {
      this.selectedColors = this.selectedColors.filter((c) => c !== id);
    } else {
      this.selectedColors.push(id);
    }
    this.emitChanges();
  }

  onPriceChange(): void {
    this.emitChanges();
  }

  onNewArrivalsChange(value: boolean): void {
    this.showNewArrivals = value;
    this.emitChanges();
  }

  clearAllFilters(): void {
    this.selectedCategories = [];
    this.selectedColors = [];
    this.priceRange = [0, 1500];
    this.showNewArrivals = false;
    this.emitChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
