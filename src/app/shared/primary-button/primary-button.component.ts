import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.css',
})
export class PrimaryButtonComponent {
  @Output() onClickChange = new EventEmitter();
  @Input() text: string = 'Submit';
  @Input() col: string = 'col-sm-4';
  @Input() disabled: boolean = false;
  onClick() {
    this.onClickChange.emit();
  }
}
