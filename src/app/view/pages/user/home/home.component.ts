import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from './components/product-card/product-card.component';

import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories.component';
import { SlideWordsComponent } from './components/slide-words/slide-words.component';
import { ProductSlideshowComponent } from './components/product-slideshow/product-slideshow.component';
import { DecorArticleComponent } from './components/Decor-Article/Decor-Article.component';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';
import { Product } from '../../../../core/interfaces/product.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent , FeaturedCategoriesComponent , SlideWordsComponent , ProductSlideshowComponent , DecorArticleComponent , RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent  {


 

 
 productsService = inject(ProductsService);
    private destroy$ = new Subject<void>();
      productsResponse?: ApiResponse<Product[]>;
   getProducts() {
     
      this.productsService
        .getProducts(
          {
            key: '',
            page: 1,
            limit: 4,
            sortBy: 'popularity',
           
          } 
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.productsResponse = data;
           
          },
          error: (err) => {
          
            console.error(err);
          },
        });
    }
     ngOnInit(): void {                   
      this.getProducts();
 
    
  }
}



