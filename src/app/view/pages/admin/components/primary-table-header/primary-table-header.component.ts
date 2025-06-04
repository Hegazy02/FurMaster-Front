import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-table-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './primary-table-header.component.html',
  styleUrl: './primary-table-header.component.css',
})
export class PrimaryTableHeaderComponent {
  @Input() columnNames: string[] = [];
}
