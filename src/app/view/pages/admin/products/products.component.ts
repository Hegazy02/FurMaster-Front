import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { NgClass, NgStyle, SlicePipe } from '@angular/common';
import { PrimaryTableComponent } from '../components/primary-table/primary-table.component';
import { PrimaryTableRowComponent } from '../components/primary-table-row/primary-table-row.component';
import { EmptyDataComponent } from '../../../../shared/empty-data/empty-data.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  AdminProduct,
  AdminProductVariant,
} from '../../../../core/interfaces/admin-product.interface';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../../core/services/products.service';
import { ApiResponse } from '../../../../core/interfaces/api-response.interface';
import { PrimaryDropDownComponent } from '../../../../shared/primary-drop-down/primary-drop-down.component';
import { ToastrService } from 'ngx-toastr';
import { PrimaryModalComponent } from '../../../../shared/primary-modal/primary-modal.component';
import { currency } from '../../../../core/constants/vairables';
import { Status, StatusType } from '../../../../core/util/status';
import { ErrorComponent } from '../../../../shared/error/error.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';

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
    PrimaryDropDownComponent,
    RouterLink,
    PrimaryModalComponent,
    ErrorComponent,
    LoaderComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements AfterViewInit {
  toastr = inject(ToastrService);
  productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  columnNames: string[] = [
    'name',
    'price',
    'colors',
    'qty',
    'rating',
    'actions',
  ];
  dropDownOptions = [
    { title: 'Heigh price', apiValue: 'price_desc' },
    { title: 'Low price', apiValue: 'price_asc' },
    { title: 'A-Z', apiValue: 'title_asc' },
    { title: 'Z-A', apiValue: 'title_desc' },
    { title: 'Latest', apiValue: 'createdAt_desc' },
    { title: 'Oldest', apiValue: 'createdAt_asc' },
    { title: 'Popularity', apiValue: 'popularity' },
    { title: 'Out of stock', apiValue: 'out_of_stock' },
  ];
  productsResponse?: ApiResponse<AdminProduct[]>;
  limit = 10;
  page = 1;
  searchbyTitle: string = '';
  sortBy = { value: '', apiValue: '' };
  searchInput = new Subject<string>();
  selectedDeletedProductId: string = '';
  cureency = currency;
  productsStatus = new Status();
  StatusType = StatusType;
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.getQueryParamsFromUrl();
    this.subScribeToSearchInput();
  }
  ngAfterViewInit(): void {
    this.paginator.pageIndex = this.page - 1;
    this.getProducts();
  }
  getProducts() {
    this.productsStatus = new Status(StatusType.Loading);
    this.productsService
      .getAdminProducts(
        this.page,
        this.limit,
        this.searchbyTitle,
        this.sortBy.apiValue
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.productsResponse = data;
          this.productsStatus = new Status(StatusType.Success);
        },
        error: (err) => {
          this.productsStatus = new Status(StatusType.Error);
          console.error(err);
        },
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
        this.setQueryParamsToUrl({ page: this.page.toString(), title: value });
        this.paginator.firstPage();
        this.getProducts();
      });
  }
  private getQueryParamsFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.page = parseInt(params['page']) ?? 1;
        this.limit = params['limit'] ?? 10;
        this.searchbyTitle = params['title'] ?? '';
        if (params['sortBy']) {
          this.sortBy = {
            value: this.derivedOption(params['sortBy']),
            apiValue: params['sortBy'],
          };
        }
      });
  }
  setQueryParamsToUrl(params: { [key: string]: string }) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(data: { title: string; apiValue: string }) {
    this.sortBy = { value: data.title, apiValue: data.apiValue };
    this.setQueryParamsToUrl({ sort: this.sortBy.apiValue });
    this.getProducts();
  }
  getColumnClass(cols?: number): string {
    const length = this.columnNames.length || 1;
    const colSize = Math.floor(12 / length);
    return `col-${cols ?? colSize}`;
  }

  getQuantity(colors: AdminProductVariant[]): number {
    return colors.reduce((acc, color) => acc + color.stock, 0);
  }
  deletePrdouct(id: string) {
    const index = this.productsResponse?.data.findIndex((p) => p._id === id)!;
    const product = this.productsResponse?.data.find((p) => p._id === id);

    this.productsService
      .deleteProduct(product!._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.productsResponse?.data.splice(index, 1);
          this.toastr.success('Product deleted Successfully');
        },
        error: (err) => {
          this.toastr.error(err);
          console.error(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
  derivedOption(value: string) {
    switch (value) {
      case 'price_desc':
        return 'High price';
      case 'price_asc':
        return 'Low price';
      case 'title_asc':
        return 'A-Z';
      case 'title_desc':
        return 'Z-A';
      case 'createdAt_desc':
        return 'Latest';
      case 'createdAt_asc':
        return 'Oldest';
      case 'popularity':
        return 'Popularity';
      case 'out_of_stock':
        return 'Out of stock';
      default:
        return 'Sort By';
    }
  }
}
