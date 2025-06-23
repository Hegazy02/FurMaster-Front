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
error:string | null=null

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private destroy$ = new Subject<void>();

  fromDate: string = '';
  toDate: string = '';
  orders: Order[] = [];
  userId: string = '';
  statuses: string[] = ['pending', 'completed', 'cancelled'];

  page = 1;
  limit = 10;
  status = '';
  totalPages = 0;
  sort = '-createdAt';

  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
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
    this.error=null;

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
    ).subscribe({next:res => {
      this.orders = res.data;
      this.loading = false;
      this.totalPages = res.totalPages ?? 0;
      this.totalItems = res.totalItems ?? 0;},
      error: (err) => {
      console.error('Error loading orders:', err);
      this.loading = false;
      this.error = err?.error?.message || 'Failed to load orders. Please try again later.';
    }
    });
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

  onSortChange(data: { value: string; apiValue: string }) {
    this.sort = data.apiValue;
    this.page = 1;
    this.setQueryParamsToUrl({
      sort: this.sort,
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
      dateFrom: this.dateFrom || '',
      dateTo: this.dateTo || '',
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
        this.dateFrom = params['dateFrom'] || '';
        this.dateTo = params['dateTo'] || '';
        this.sort = params['sort'] || '-createdAt';
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

  constructor(private orderService: OrdersService) { }
}
