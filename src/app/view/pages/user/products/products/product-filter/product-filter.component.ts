import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../../../../core/services/products.service';
import { Category } from '../../../../../../core/interfaces/category.interface';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.component.html',
})
export class ProductFilterComponent implements OnInit {
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
    this.productService.getCategories().subscribe((res) => {
      if (res.success) this.categories = res.data;
    });
  }

  fetchColors(): void {
    this.productService.getColors().subscribe((res) => {
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

  handleCategoryChange(id: string, event: any): void {
    event.target.checked
      ? this.selectedCategories.push(id)
      : (this.selectedCategories = this.selectedCategories.filter((c) => c !== id));
    this.emitChanges();
  }

  handleColorChange(id: string, event: any): void {
    event.target.checked
      ? this.selectedColors.push(id)
      : (this.selectedColors = this.selectedColors.filter((c) => c !== id));
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
}
