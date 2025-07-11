import { Component, Input } from '@angular/core';
import { PrimaryTableHeaderComponent } from '../primary-table-header/primary-table-header.component';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-primary-table',
  standalone: true,
  imports: [PrimaryTableHeaderComponent, NgClass,NgStyle],
  templateUrl: './primary-table.component.html',
  styleUrl: './primary-table.component.css',
})
export class PrimaryTableComponent {
  @Input() columnNames: string[] = [];
  @Input() customSizes: string[] = [];
  @Input() isEmpty: boolean = true;
  @Input() hasMinHeight: boolean = true;
}
