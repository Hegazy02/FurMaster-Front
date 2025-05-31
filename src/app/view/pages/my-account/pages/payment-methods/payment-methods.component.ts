import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PaymentMethodCardComponent } from './payment-method-card/payment-method-card.component';
import { PaymentMethod } from '../../../../../core/interfaces/payment-method.interface';
import { PaymetMethodsService } from '../../../../../core/services/paymet-methods.service';
import { Status, StatusType } from '../../../../../core/util/status';
import { PrimaryButtonComponent } from '../../../../../shared/primary-button/primary-button.component';
import { ErrorComponent } from '../../../../../shared/error/error.component';
import { NgClass } from '@angular/common';
import {
  FloatingMessageComponent,
  MessageType,
} from '../../../../../shared/floating-message/floating-message.component';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [
    PaymentMethodCardComponent,
    PrimaryButtonComponent,
    ErrorComponent,
    NgClass,
    FloatingMessageComponent,
  ],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.css',
})
export class PaymentMethodsComponent implements OnInit {
  // In your component
  constructor(private cdr: ChangeDetectorRef) {}

  paymetMethodsService = inject(PaymetMethodsService);
  MessageType = MessageType;
  StatusType = StatusType;
  getPaymentMethodsStatus = new Status();
  deleteStatus = new Status();
  setDefaultStatus = new Status();

  cards: PaymentMethod[] = [];
  ngOnInit(): void {
    this.getPaymentMethodsStatus = new Status(StatusType.Loading);
    this.paymetMethodsService.getPaymentMethods()?.subscribe({
      next: (data) => {
        console.log('cards', data);
        this.getPaymentMethodsStatus = new Status(StatusType.Success);

        this.cards = data;
      },
      error: (err) => {
        this.getPaymentMethodsStatus = new Status(StatusType.Error);
        console.error('Error getting payment methods:', err);
      },
    });
  }
  addCard() {}
  onSetAsDefault(card: PaymentMethod) {
    this.setDefaultStatus = new Status(StatusType.Loading);
    this.cdr.detectChanges(); // Force change detection

    if (card.isDefault) {
      this.setDefaultStatus = new Status(
        StatusType.Error,
        'Card is already default'
      );
      return;
    }
    this.paymetMethodsService
      .updatePaymentMethod(card._id, {
        isDefault: true,
      })
      ?.subscribe({
        next: (data) => {
          this.setDefaultStatus = new Status(
            StatusType.Success,
            'Card set as default'
          );
          this.cards = data;
        },
        error: (err) => {
          this.setDefaultStatus = new Status(
            StatusType.Error,
            'Error setting card as default'
          );
        },
      });
  }
  onDelete(card: PaymentMethod) {
    this.deleteStatus.type = StatusType.Loading;
    this.paymetMethodsService.deletePaymentMethod(card._id)?.subscribe({
      next: (data) => {
        this.deleteStatus = new Status(StatusType.Success, 'Card deleted');
        this.excludeCard(card);
      },
      error: (err) => {
        this.deleteStatus = new Status(StatusType.Error, 'Error deleting card');
      },
    });
  }
  excludeCard(card: PaymentMethod) {
    this.cards = this.cards.filter((c) => c._id !== card._id);
  }
}
