import { Component, EventEmitter, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css',
})
export class SearchInputComponent {
  @Output() onSearch = new EventEmitter<string>();
  faSearch = faSearch;

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch.emit(value);
  }
}
