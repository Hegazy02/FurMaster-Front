import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../../../core/interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
<<<<<<< HEAD
  styleUrls: ["./product-card.component.css"]
=======
>>>>>>> 7f615970c190a93d77325cf0e0de3fe6f0bd0a00
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() hoveredProduct: string | null = null;
<<<<<<< HEAD
  currentImageIndex: number = 0;

=======
>>>>>>> 7f615970c190a93d77325cf0e0de3fe6f0bd0a00

  isNewArrival(date: Date): boolean {
    const addedDate = new Date(date);
    const currentDate = new Date();
    const daysDiff = (currentDate.getTime() - addedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30;
  }

  getStarArray(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  getStarClass(index: number, rating: number): string {
    if (index < Math.floor(rating)) return 'text-yellow-500';
    if (index < rating) return 'text-yellow-300';
    return 'text-gray-300';
  }
}
