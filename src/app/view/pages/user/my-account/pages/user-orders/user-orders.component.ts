import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../../../core/services/orders.service';
import { EmptyDataComponent } from "../../../../../../shared/empty-data/empty-data.component";
import { Order } from '../../../../../../core/interfaces/order.interface';
import { PrimaryDropDownComponent } from '../../../../../../shared/primary-drop-down/primary-drop-down.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorComponent } from "../../../../../../shared/error/error.component";

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EmptyDataComponent,
    PrimaryDropDownComponent,
    MatPaginator,
    ErrorComponent
  ],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();

  orders: Order[] = [];
  groupedOrders: { [date: string]: Order[] } = {};

  userId: string = '';
  page = 1;
  limit = 10;
  status = '';
  sort = '-createdAt';

  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;

  totalPages = 0;
  totalItems = 0;

  selectedStatusText: string = 'All Statuses';

  statusOptions = [
    { title: 'All Statuses', apiValue: '' },
    { title: 'Completed', apiValue: 'completed' },
    { title: 'Pending', apiValue: 'pending' },
    { title: 'Cancelled', apiValue: 'cancelled' },
    { title: 'Processing', apiValue: 'processing' },
  ];

  ngOnInit(): void {
    this.getQueryParamsFromUrl();
    this.error = null;
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getUserOrders(
      this.page,
      this.limit || 10,
      this.status,
      this.sort,
      this.minPrice,
      this.maxPrice,
      this.dateFrom,
      this.dateTo
    ).subscribe({
      next: res => {
        this.orders = res.data;
        this.groupOrdersByDate(); 
        this.loading = false;
        this.totalPages = res.totalPages ?? 0;
        this.totalItems = res.totalItems ?? 0;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load orders. Please try again later.';
      }
    });
  }

  groupOrdersByDate() {
    this.groupedOrders = {};
    this.orders.forEach(order => {
      const dateKey = new Date(order.createdAt).toDateString();
      if (!this.groupedOrders[dateKey]) {
        this.groupedOrders[dateKey] = [];
      }
      this.groupedOrders[dateKey].push(order);
    });
  }

  getGroupedOrderDates(): string[] {
    return Object.keys(this.groupedOrders);
  }

  onStatusChange(value: { title: string; apiValue: string }) {
    this.selectedStatusText = value.title;
    this.status = value.apiValue;
    this.page = 1;
    this.setQueryParamsToUrl({
      status: this.status,
      page: this.page.toString(),
      limit: this.limit.toString(),
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.setQueryParamsToUrl({
      page: this.page.toString(),
      limit: this.limit.toString(),
      status: this.status,
      sort: this.sort,
    });
  }

  getProductNames(products: any[]): string {
    const maxNames = 3;
    const names = products.map(p => p.name);
    const displayedNames = names.slice(0, maxNames);
    const remaining = names.length - maxNames;

    if (remaining > 0) {
      return `${displayedNames.join(', ')} and ${remaining} more items`;
    } else {
      return displayedNames.join(', ');
    }
  }

  getQueryParamsFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.page = parseInt(params['page']) || 1;
        this.limit = parseInt(params['limit']) || 10;
        this.status = params['status'] || '';
        this.sort = params['sort'] || '-createdAt';
        this.dateRange = (params['dateRange'] as any) || 'all';
this.setDateRange(this.dateRange);

        this.loadOrders();

      });
  }

  setQueryParamsToUrl(params: { [key: string]: string }) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private orderService: OrdersService) {}


  dateRange: '3m' | '6m' | '1y' | 'all' = 'all'; 

onDateFilterChange(range: '3m' | '6m' | '1y' | 'all') {
  this.dateRange = range;
  this.setDateRange(range);
  this.page = 1;
  this.setQueryParamsToUrl({
    dateRange: this.dateRange,
    page: this.page.toString(),
    limit: this.limit.toString(),
    status: this.status,
    sort: this.sort,
  });
  this.loadOrders();
}

setDateRange(range: string) {
  const today = new Date();
  let from: Date | null = null;

  switch (range) {
    case '3m':
      from = new Date(today.setMonth(today.getMonth() - 3));
      break;
    case '6m':
      from = new Date(today.setMonth(today.getMonth() - 6));
      break;
    case '1y':
      from = new Date(today.setFullYear(today.getFullYear() - 1));
      break;
    case 'all':
      from = null;
      break;
  }

  this.dateFrom = from ? from.toISOString().split('T')[0] : '';
  this.dateTo = new Date().toISOString().split('T')[0];
}

}
