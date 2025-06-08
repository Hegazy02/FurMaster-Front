import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { NgClass, NgStyle, SlicePipe } from '@angular/common';
import { PrimaryTableComponent } from '../components/primary-table/primary-table.component';
import { PrimaryTableRowComponent } from '../components/primary-table-row/primary-table-row.component';
import { EmptyDataComponent } from '../../../../shared/empty-data/empty-data.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  AdminProduct,
  AdminProductColor,
} from '../../../../core/interfaces/admin-product.interface';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    SearchInputComponent,
    SlicePipe,
    PrimaryTableComponent,
    PrimaryTableRowComponent,
    NgClass,
    NgStyle,
    EmptyDataComponent,
    MatPaginator,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements AfterViewInit {
  columnNames: string[] = [
    'name',
    'price',
    'colors',
    'qty',
    'rating',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  productsResponse?: ApiResponse<AdminProduct[]>;
  limit = 10;
  page = 1;
  searchbyTitle: string = '';
  createdAt: string = '';
  searchInput = new Subject<string>();
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.subScribeToSearchInput();
  }
  ngAfterViewInit(): void {
    this.getQueryParamsFromUrl();
    this.getProducts();
  }
  getProducts() {
    this.productsService
      .getAdminProducts(
        this.page,
        this.limit,
        this.searchbyTitle,
        this.createdAt
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.productsResponse = data;
        },
        error: (err) => console.error(err),
      });
  }
  onSearch(value: string) {
    this.searchInput.next(value);
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.setQueryParamsToUrl({
      page: this.page.toString(),
    });
    this.getProducts();
  }
  subScribeToSearchInput() {
    this.searchInput
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.searchbyTitle = value;
        this.page = 1;
        this.setQueryParamsToUrl({ page: this.page.toString(), name: value });
        this.paginator.firstPage();
        this.getProducts();
      });
  }
  private getQueryParamsFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.page = parseInt(params['page']) ?? 1;
        this.paginator.pageIndex = this.page - 1;
        this.limit = params['limit'] ?? 10;
        this.searchbyTitle = params['name'] ?? '';
        this.createdAt = params['sort'] ?? '';
      });
  }
  setQueryParamsToUrl(params: { [key: string]: string }) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
  getColumnClass(): string {
    const length = this.columnNames?.length || 1;
    const colSize = Math.floor(12 / length);
    return `col-${colSize}`;
  }

  getQuantity(colors: AdminProductColor[]): number {
    return colors.reduce((acc, color) => acc + color.stock, 0);
  }
}
