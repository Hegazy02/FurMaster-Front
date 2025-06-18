import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../../core/interfaces/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-grid.component.html',
})
export class ProductGridComponent implements OnChanges {
  @Input() products: Product[] = [];
  @Input() showNewArrivals: boolean = false;

  sortBy: string = 'newest';
  hoveredProduct: string | null = null;
  sortedProducts: Product[] = [];

  @Output() sortChanged = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] || changes['showNewArrivals']) {
      this.applySortingAndFiltering();
    }
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value;
    this.sortChanged.emit(this.sortBy);
    this.applySortingAndFiltering();
  }

  applySortingAndFiltering(): void {
    let filtered = [...this.products];

    if (this.showNewArrivals) {
      filtered = filtered.filter((product) => this.isNewArrival(product.createdAt));
    }

    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.ratingCounter - a.ratingCounter);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    this.sortedProducts = filtered;
  }

  isNewArrival(date: Date): boolean {
    const addedDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = (currentDate.getTime() - addedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30;
  }
}
