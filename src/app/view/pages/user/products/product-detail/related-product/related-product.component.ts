import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../../core/interfaces/product.interface';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-related-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './related-product.component.html',
  styleUrls: ["./related-product.component.css"]
})
export class RelatedProductComponent {
  @Input() relatedProducts: Product[] = [];
  @Input() categoryName: string = '';

  constructor(private router: Router) {}

  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  getStarClass(index: number, rating: number): string {
    if (index < Math.floor(rating)) return 'text-yellow-400 fill-current';
    else if (index < rating) return 'text-yellow-400 fill-current opacity-50';
    else return 'text-gray-300 fill-current';
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }


}