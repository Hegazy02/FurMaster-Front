import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PaymentMethod } from '../../../../../../core/interfaces/payment-method.interface';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PaymetMethodsService } from '../../../../../../core/services/paymet-methods.service';

@Component({
  selector: 'app-payment-method-card',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './payment-method-card.component.html',
  styleUrl: './payment-method-card.component.css',
})
export class PaymentMethodCardComponent {
  faCheck = faCheck;
  faTrash = faTrash;
  @Input({ required: true }) card!: PaymentMethod;
  @Output() setDefault = new EventEmitter<PaymentMethod>();
  @Output() delete = new EventEmitter<PaymentMethod>();
  onSetAsDefault() {
    this.setDefault.emit(this.card);
  }
  onDelete() {
    this.delete.emit(this.card);
  }
}
