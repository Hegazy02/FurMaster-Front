import { Component } from '@angular/core';
import { SearchInputComponent } from '../../../../shared/search-input/search-input.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SearchInputComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  onSearch(value: string) {}
}
