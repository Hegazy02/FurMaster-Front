import { Component, Input } from '@angular/core';
import { PaymentMethod } from '../../../../../../core/interfaces/payment-method.interface';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-payment-method-card',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './payment-method-card.component.html',
  styleUrl: './payment-method-card.component.css',
})
export class PaymentMethodCardComponent {
  @Input({ required: true }) card!: PaymentMethod;
}
