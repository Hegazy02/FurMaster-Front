import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimaryButtonComponent } from '../../../../../../shared/primary-button/primary-button.component';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-add-payment-method-card',
  standalone: true,
  imports: [PrimaryButtonComponent, NgStyle],
  templateUrl: './add-payment-method-card.component.html',
  styleUrl: './add-payment-method-card.component.css',
})
export class AddPaymentMethodCardComponent {
  @Output() onClickChange = new EventEmitter<void>();

  @Input() buttonText: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() imageSize: number = 180;
  @Input() contentPadding: number = 30;
  onClick() {
    this.onClickChange.emit();
  }
}
