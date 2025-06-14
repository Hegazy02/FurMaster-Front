import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-data',
  standalone: true,
  imports: [],
  templateUrl: './empty-data.component.html',
  styleUrl: './empty-data.component.css',
})
export class EmptyDataComponent {
  @Input() title: string = 'No Data';
  @Input() subtitle: string = 'No data found';
}
