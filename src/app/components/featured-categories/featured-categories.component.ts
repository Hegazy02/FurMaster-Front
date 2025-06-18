import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-featured-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-categories.component.html',
  styleUrls: ['./featured-categories.component.css'],
})
export class FeaturedCategoriesComponent {
  featuredCategories = [
    { id: '1', name: 'Cabinet', icon: '/assets/icons/cabinet.webp' },
    { id: '2', name: 'Chair', icon: '/assets/icons/chair.webp' },
    { id: '3', name: 'Lamp', icon: '/assets/icons/Lamp.webp' },
    { id: '4', name: 'Light', icon: '/assets/icons/light.webp' }
  ];

  galleryItems = [
    { id: '1', title: 'Classic Wood Table', imgUrl: '/assets/images/table.webp' },
    { id: '2', title: 'Vintage Wooden Chair', imgUrl: '/assets/images/Chair.webp' },
    { id: '3', title: 'Elegant Wooden Cabinet', imgUrl: '/assets/images/Cabinet.webp' },
    { id: '4', title: 'Rustic Bookshelf', imgUrl: '/assets/images/bookshelf.webp' }
  ];
  
}


