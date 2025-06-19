import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Category } from '../../../../../core/interfaces/category.interface';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { BreadcrumbComponent } from '../../../../../shared/breadcrump/breadcrump.component'; // عدلي المسار لو مختلف


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule , PaginationComponent, BreadcrumbComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})

export class CategoriesComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);

  categories: Category[] = [];
  loading = true;
  searchQuery = '';

  /// Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  breadcrumbItems = [
  { label: 'Home', link: '/' },
  { label: 'Categories' }
];


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
    this.router.navigate(['/products'], { queryParams: { categoryId } });
  }

  getDefaultImage(): string {
    return 'https://plus.unsplash.com/premium_photo-1676320514018-ec119b57dbce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  }
}