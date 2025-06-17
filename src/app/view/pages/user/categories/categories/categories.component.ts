import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Category } from '../../../../../core/interfaces/category.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})

export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);

  categories: Category[] = [];
  loading = true;
  searchQuery = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    
    const params = {
      page: this.currentPage,
      ...(this.searchQuery && { search: this.searchQuery })
    };

    this.categoriesService.getCategories(params).subscribe({
      next: (response) => {
        this.categories = response.data;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadCategories();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadCategories();
  }

  navigateToCategory(categoryId: string) {
this.router.navigate(['/publicProducts'], { queryParams: { categoryId } });
  }

  getDefaultImage(): string {
    return 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg';
  }
}