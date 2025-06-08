import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { PrimaryTableRowComponent } from '../components/primary-table-row/primary-table-row.component';
import { User } from '../../../../core/interfaces/user.interface';
import { PrimaryTableComponent } from '../components/primary-table/primary-table.component';
import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EmptyDataComponent } from '../../../../shared/empty-data/empty-data.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { PrimaryDropDownComponent } from '../../../../shared/primary-drop-down/primary-drop-down.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SearchInputComponent,
    PrimaryTableComponent,
    NgClass,
    PrimaryTableRowComponent,
    DatePipe,
    SlicePipe,
    MatPaginator,
    EmptyDataComponent,
    PrimaryDropDownComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userService = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  columnNames: string[] = ['name', 'phone number', 'created', 'city'];
  users: User[] = [];
  totalPages: number = 0;
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  searchbyEmail: string = '';
  searchInput = new Subject<string>();
  createdAt: string = '';
  private destroy$ = new Subject<void>();
  dropDownOptions = [
    { title: 'Ascending', onClick: () => this.onSortChange('asc') },
    { title: 'Descending', onClick: () => this.onSortChange('desc') },
  ];
  ngOnInit(): void {
    this.getQueryParamsFromUrl();
    this.subScribeToSearchInput();
  }
  ngAfterViewInit(): void {
    this.paginator.pageIndex = this.page - 1;
    this.getUsers();
  }
  getUsers() {
    this.userService
      .getUsers(this.page, this.limit, this.searchbyEmail, this.createdAt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.users = data.data ?? [];
          this.totalPages = data.totalPages ?? 0;
          this.total = data.total ?? 0;
        },
        error: (err) => console.error(err),
      });
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.setQueryParamsToUrl({
      page: this.page.toString(),
    });
    this.getUsers();
  }
  onSearch(value: string) {
    this.searchInput.next(value);
  }
  subScribeToSearchInput() {
    this.searchInput
      .pipe(takeUntil(this.destroy$))
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.searchbyEmail = value;
        this.page = 1;
        this.setQueryParamsToUrl({ page: this.page.toString(), email: value });
        this.paginator.firstPage();
        this.getUsers();
      });
  }
  private getQueryParamsFromUrl() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.page = parseInt(params['page']) ?? 1;
        this.limit = params['limit'] ?? 10;
        this.searchbyEmail = params['email'] ?? '';
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
  onSortChange(value: string) {
    this.createdAt = value;
    this.setQueryParamsToUrl({ sort: this.createdAt });
    this.getUsers();
  }
  onEdit(user: User) {}
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
