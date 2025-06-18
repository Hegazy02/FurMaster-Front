import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../../../core/services/orders.service';
import { EmptyDataComponent } from "../../../../../../shared/empty-data/empty-data.component";
import { Order } from '../../../../../../core/interfaces/order.interface';
import { PrimaryDropDownComponent } from '../../../../../../shared/primary-drop-down/primary-drop-down.component';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyDataComponent,PrimaryDropDownComponent],
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


  
}
