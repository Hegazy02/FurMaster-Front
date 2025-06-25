import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-primary-drop-down',
  standalone: true,
  imports: [],
  templateUrl: './primary-drop-down.component.html',
  styleUrl: './primary-drop-down.component.css',
})
export class PrimaryDropDownComponent {
  @Input() buttonText: string = '';
  @Input() options: { title: string; apiValue: string }[] = [];
  @Output() onClickChange = new EventEmitter();
  @Input() classes: string = '';

  onClick(data: any) {
    this.onClickChange.emit(data);
  }
}
