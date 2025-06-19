import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-dropdown',
  templateUrl: './status-dropdown.component.html',
  styleUrl: './status-dropdown.component.css',
  standalone: true,
})
export class StatusDropdownComponent {
  @Input() selectedStatus: string = 'pending';
  @Output() statusChange = new EventEmitter<string>();
  isOpen: boolean = false;

  statusOptions: string[] = ['pending', 'processing', 'completed', 'cancelled'];

  derivedStatusStyle(status: string): string {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
  getStatusDisplayStyle(status: string): string {
    const statusStyle = this.derivedStatusStyle(status);
    return `label ${statusStyle}`;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  handleStatusChange(status: string): void {
    this.selectedStatus = status;
    this.isOpen = false;
    this.statusChange.emit(status);
  }
}
