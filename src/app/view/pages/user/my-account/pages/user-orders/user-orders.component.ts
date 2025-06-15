import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../../../core/services/orders.service';
import { EmptyDataComponent } from "../../../../../../shared/empty-data/empty-data.component";
import { Order } from '../../../../../../core/interfaces/order.interface';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyDataComponent],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent implements OnInit {
  ngOnInit(): void {
    this.loadOrders();
  }

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

  loadOrders() {
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
      this.totalPages = res.totalPages ?? 0;
    });
  }






}
