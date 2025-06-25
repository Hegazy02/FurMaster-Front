import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Status, StatusType } from '../../../../../core/util/status';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Category } from '../../../../../core/interfaces/category.interface';
import { BreadcrumbComponent } from '../../../../../shared/breadcrump/breadcrump.component';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchInputComponent } from '../../../../../shared/search-input/search-input.component';
import { BannerComponent } from '../../../../../shared/banner/banner.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    LoaderComponent,
    SearchInputComponent,
    BannerComponent,
    MatPaginatorModule,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'scale(0.95)' }),
            stagger(
              '300ms',
              animate(
                '400ms ease-out',
                style({ opacity: 1, transform: 'scale(1)' })
              )
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  categories: Category[] = [];
  loading = true;
  searchQuery = '';

  categoriesStatus = new Status();
  StatusType = StatusType;

  /// Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  breadcrumbItems = [{ label: 'Home', link: '/' }, { label: 'Categories' }];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesStatus = new Status(StatusType.Loading);
    const params = {
      page: this.currentPage,
      ...(this.searchQuery && { search: this.searchQuery }),
    };

    this.categoriesService
      .getCategories(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.categories = response.data;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalItems;
          this.currentPage = response.page;
          this.categoriesStatus = new Status(StatusType.Success);
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.categoriesStatus = new Status(
            StatusType.Error,
            'Failed to load categories.'
          );
        },
      });
  }

  onSearchChange(val: string) {
    this.searchQuery = val;
    this.currentPage = 1;
    this.loadCategories();
  }

  onSearchEnter(val: string) {
    this.searchQuery = val;
    this.currentPage = 1;
    this.loadCategories();
  }

  handlePageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.loadCategories();
  }

  navigateToCategory(categoryId: string) {
    this.router.navigate(['/products'], { queryParams: { categoryId } });
  }

  getDefaultImage(): string {
    return 'https://plus.unsplash.com/premium_photo-1676320514018-ec119b57dbce?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
