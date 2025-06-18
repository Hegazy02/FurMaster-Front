import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: string;
  title: string;
  image: string;
  price?: number;
}

@Component({
  selector: 'app-product-slideshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-slideshow.component.html',
  styleUrls: ['./product-slideshow.component.css'],
})
export class ProductSlideshowComponent implements OnInit {
  @Input() products: Product[] = [];

  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.nextSlide();
    }, 4000); // slide every 4 seconds
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
  }
}
