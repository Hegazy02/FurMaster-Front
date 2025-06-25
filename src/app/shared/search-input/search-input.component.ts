import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
})
export class SearchInputComponent {
  @Input() search: string = '';
  @Input() placeholder: string = 'Search...';

  @Output() searchEnter = new EventEmitter<string>();
  @Output() searchDebounced = new EventEmitter<string>();

  faSearch = faSearch;
  faTimes = faTimes;

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(1000)).subscribe((val) => {
      this.searchDebounced.emit(val);
    });
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
    this.searchSubject.next(value);
  }

  onEnter() {
    this.searchEnter.emit(this.search);
  }

  clearSearch() {
    this.search = '';
    this.searchDebounced.emit('');
    this.searchEnter.emit('');
  }
}
