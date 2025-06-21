import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyDataComponent,PrimaryDropDownComponent,  MatPaginator,
],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit {
 loading = true;
  ngOnInit(): void {
    this.loadOrders();
    this.getQueryParamsFromUrl();


  }
      private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

private destroy$ = new Subject<void>();

  fromDate: string = '';
  toDate: string = '';

  orders: Order[] = [];
  userId: string = '';
  statuses: string[] = ['pending', 'completed', 'cancelled'];
  constructor(private orderService: OrdersService) { }

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

  loadOrders() {
this.loading = true;

    this.orderService.getUserOrders(

      this.page,
      this.limit || 10, this.status,
      this.sort,

      this.minPrice,
      this.maxPrice,
      this.dateFrom,
      this.dateTo
    ).subscribe(res => {
      this.orders = res.data;
      this.loading = false;

      this.totalPages = res.totalPages ?? 0;
      this.totalItems = res.totalItems ?? 0; 
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


statusOptions = [
  { title: 'All Statuses', apiValue: '' },
  { title: 'Completed', apiValue: 'completed' },
  { title: 'Pending', apiValue: 'pending' },
  { title: 'Cancelled', apiValue: 'cancelled' },
    { title: 'processing', apiValue: 'processing' },

];

selectedStatusText: string = 'All Statuses';

  onStatusChange(value: { title: string; apiValue: string }) {
      this.selectedStatusText = value.title;

  this.status = value.apiValue;
  this.loadOrders();
}

onPageChange(event: PageEvent): void {
  this.page = event.pageIndex + 1;
  this.limit = event.pageSize;
  this.setQueryParamsToUrl({
    page: this.page.toString(),
    limit: this.limit.toString(),
  });
  this.loadOrders();
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


  onSortChange(data: { value: string; apiValue: string }) {
    this.sort = data.apiValue;
    this.setQueryParamsToUrl({ sortBy: data.apiValue });
    this.loadOrders();
  }
}