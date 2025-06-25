import { Component, inject, ViewChild } from '@angular/core';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { PrimaryTableComponent } from '../components/primary-table/primary-table.component';
import { PrimaryTableRowComponent } from '../components/primary-table-row/primary-table-row.component';
import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { EmptyDataComponent } from '../../../../shared/empty-data/empty-data.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AdminOrder } from '../../../../core/interfaces/admin-order.interface';
import { OrdersService } from '../../../../core/services/orders.service';
import { StatusDropdownComponent } from './status-dropdown/status-dropdown.component';
import { currency } from '../../../../core/constants/vairables';
import { Status, StatusType } from '../../../../core/util/status';
import { LoaderComponent } from "../../../../shared/loader/loader.component";
import { ErrorComponent } from "../../../../shared/error/error.component";

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    SearchInputComponent,
    PrimaryTableComponent,
    PrimaryTableRowComponent,
    NgClass,
    DatePipe,
    SlicePipe,
    EmptyDataComponent,
    MatPaginator,
    StatusDropdownComponent,
    LoaderComponent,
    ErrorComponent
],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  ordersService = inject(OrdersService);
  total: number = 0;
  page: number = 1;
  searchbyOrderNumber = '';
  columnNames = ['Number', 'Date', 'Customer', 'Amount', 'Status', 'Paid'];
  orders: AdminOrder[] = [];
  searchInput = new Subject<string>();
  currency = currency;
  ordersStatus = new Status();
  StatusType = StatusType;

  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.getQueryParamsFromUrl();
    this.subScribeToSearchInput();
    this.getOrders();
  }
  onSearch(value: string) {
    this.searchInput.next(value);
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.setQueryParamsToUrl({
      page: this.page.toString(),
    });
    this.getOrders(this.page, 10, this.searchbyOrderNumber);
  }
  private getQueryParamsFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.page = parseInt(params['page']) ?? 1;
        this.searchbyOrderNumber = params['orderNumber'] ?? '';
        // if (params['sort']) {
        //   this.sortBy = {
        //     value: this.derivedOption(params['sort']),
        //     apiValue: params['sort'],
        //   };
        // }
      });
  }
  subScribeToSearchInput() {
    this.searchInput
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.searchbyOrderNumber = value;
        this.page = 1;
        this.setQueryParamsToUrl({ page: this.page.toString(), email: value });
        this.paginator.firstPage();
        this.getOrders(this.page, 10, this.searchbyOrderNumber);
      });
  }
  setQueryParamsToUrl(params: { [key: string]: string }) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  getOrders(page: number = 1, limit: number = 10, number: string = '') {
    this.ordersStatus = new Status(StatusType.Loading);
    this.ordersService
      .getAllOrders(page, limit, number)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.orders = result.data ?? [];
          this.total = result.total ?? 0;
          this.ordersStatus = new Status(StatusType.Success);
        },
        error: (error) => {
          this.ordersStatus = new Status(StatusType.Error);
          console.error(error);
        },
      });
  }
  handleStatusChange(status: string, order: AdminOrder): void {
    this.ordersService
      .updateOrderStatus(order._id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          // this.getOrders(this.page, 10, this.searchbyOrderNumber);
        },
        error: (error) => {
          this.ordersStatus = new Status(StatusType.Error);
          console.error(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
