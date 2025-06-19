import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FaIconComponent, FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent {
  faSearch = faSearch;
  @Input() searchBy: string = '';
  @Input({ required: false }) search: string = '';
  @Output() searchChange = new EventEmitter<string>();

  onSearch(event: Event) {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
