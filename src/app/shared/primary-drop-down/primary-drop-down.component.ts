import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-drop-down',
  standalone: true,
  imports: [],
  templateUrl: './primary-drop-down.component.html',
  styleUrl: './primary-drop-down.component.css',
})
export class PrimaryDropDownComponent {
  @Input() buttonText: string = '';
  @Input() options: { title: string; onClick: () => any }[] = [];
}
