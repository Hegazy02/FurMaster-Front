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
import { Status, StatusType } from '../../../../core/util/status';
import { ErrorComponent } from '../../../../shared/error/error.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';

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
    ErrorComponent,
    LoaderComponent,
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
  sortBy = { value: '', apiValue: '' };
  usersStatus = new Status();
  StatusType = StatusType;

  private destroy$ = new Subject<void>();
  dropDownOptions = [
    { title: 'Ascending', apiValue: 'asc' },
    { title: 'Descending', apiValue: 'desc' },
  ];
  ngOnInit(): void {
    this.getQueryParamsFromUrl();
    this.subScribeToSearchInput();
  }
  ngAfterViewInit(): void {
    this.paginator.pageIndex = this.page - 1;
    this.getUsers();
    this.subScribeToSearchInput();
  }

  getUsers() {
    this.usersStatus.type = StatusType.Loading;
    this.userService
      .getUsers(
        this.page,
        this.limit,
        this.searchbyEmail,
        'createdAt',
        this.sortBy.apiValue
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);

          this.users = data.data ?? [];
          this.totalPages = data.totalPages ?? 0;
          this.total = data.total ?? 0;
          this.usersStatus = new Status(StatusType.Success);
        },
        error: (err) => {
          this.usersStatus = new Status(StatusType.Error);
          console.error(err);
        },
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
        if (params['sort']) {
          this.sortBy = {
            value: this.derivedOption(params['sort']),
            apiValue: params['sort'],
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
    console.log("value", data);
    
    this.sortBy = { value: data.title, apiValue: data.apiValue };
    console.log("soring", this.sortBy);
    
    this.setQueryParamsToUrl({ sort: this.sortBy.apiValue });
    this.getUsers();
  }
  onEdit(user: User) {}
  derivedOption(value: string) {
    switch (value) {
      case 'desc':
        return 'Descending';
      case 'asc':
        return 'Ascending';
      default:
        return 'Sort By';
    }
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
