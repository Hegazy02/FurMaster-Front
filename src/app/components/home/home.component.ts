import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../core/interfaces/product.model';
import { FeaturedCategoriesComponent } from '../featured-categories/featured-categories.component';
import { SlideWordsComponent } from '../slide-words/slide-words.component';
import { ProductSlideshowComponent } from '../product-slideshow/product-slideshow.component';
import { DecorArticleComponent } from '../Decor-Article/Decor-Article.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent , FeaturedCategoriesComponent , SlideWordsComponent , ProductSlideshowComponent , DecorArticleComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  products: Product[] = [];

  // constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.productService.getProducts().subscribe((result) => {
//       this.products = result.data;
//     });
//   }
}



