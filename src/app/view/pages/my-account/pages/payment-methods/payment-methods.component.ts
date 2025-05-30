import { Component, inject, OnInit } from '@angular/core';
import { PaymentMethodCardComponent } from './payment-method-card/payment-method-card.component';
import { PaymentMethod } from '../../../../../core/interfaces/payment-method.interface';
import { PaymetMethodsService } from '../../../../../core/services/paymet-methods.service';
import { Observable } from 'rxjs/internal/Observable';
import { Status, StatusType } from '../../../../../core/util/status';
import { PrimaryButtonComponent } from "../../../../../shared/primary-button/primary-button.component";

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [PaymentMethodCardComponent, PrimaryButtonComponent],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.css',
})
export class PaymentMethodsComponent implements OnInit {
  paymetMethodsService = inject(PaymetMethodsService);
  status = new Status();

  cards: PaymentMethod[] = [];
  ngOnInit(): void {
    this.status.type = StatusType.Loading;
    this.paymetMethodsService.getPaymentMethods()?.subscribe({
      next: (data) => {
        console.log('cards', data);
        this.status.type = StatusType.Success;
        // this.cards = data;
      },
      error: (err) => {
        this.status.type = StatusType.Error;
        console.error('Error getting payment methods:', err);
      },
    });
  }
  addCard() {}
}
