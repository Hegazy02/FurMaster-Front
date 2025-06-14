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
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  total: number = 0;
  page: number = 1;
  searchbyOrderNumber = '';
  columnNames = ['Number', 'Date', 'Customer', 'Amount', 'Status', 'Paid'];
  orders: AdminOrder[] = [
    {
      _id: 'test1',
      number: 1,
      createdAt: new Date(),
      customer: 'John Doe',
      amountTotal: 1000,
      status: 'pending',
      paid: false,
    },
    {
      _id: 'test2',
      number: 2,
      createdAt: new Date(),
      customer: 'John Doe',
      amountTotal: 2000,
      status: 'pending',
      paid: true,
    },
    {
      _id: 'test3',
      number: 3,
      createdAt: new Date(),
      customer: 'John Doe',
      amountTotal: 30000,
      status: 'pending',
      paid: false,
    },
  ];
  searchInput = new Subject<string>();

  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.getQueryParamsFromUrl();
    this.subScribeToSearchInput();
  }
  onSearch(value: string) {
    this.searchInput.next(value);
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.setQueryParamsToUrl({
      page: this.page.toString(),
    });
    //TODO: Get Orders
    // this.getUsers();
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
        //TODO: Get Orders
        // this.getUsers();
      });
  }
  setQueryParamsToUrl(params: { [key: string]: string }) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
  derivedStatusStyle(status: string): string {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
