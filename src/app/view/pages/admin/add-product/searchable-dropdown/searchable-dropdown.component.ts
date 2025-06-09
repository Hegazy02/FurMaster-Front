// searchable-dropdown.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdownComponent),
      multi: true,
    },
  ],
})
export class SearchableDropdownComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() searchPlaceholder: string = 'Search...';
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = true;
  @Input() maxHeight: string = '200px';
  @Input() loading: boolean = false;
  @Input() notFoundText: string = 'No options found';
  @Input() allowCustomValue: boolean = false;
  @Input() invalid: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() dropdownToggle = new EventEmitter<boolean>();

  selectedOption: DropdownOption | null = null;
  searchTerm: string = '';
  isOpen: boolean = false;
  filteredOptions: DropdownOption[] = [];

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = [...this.options];
    }
  }

  // ControlValueAccessor Methods
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.selectedOption =
        this.options.find((option) => option.value === value) || null;
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (this.disabled) return;

    this.isOpen = !this.isOpen;
    this.dropdownToggle.emit(this.isOpen);

    if (this.isOpen) {
      this.searchTerm = '';
      this.filteredOptions = [...this.options];
      setTimeout(() => {
        const searchInput = document.querySelector(
          '.dropdown-search'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  selectOption(option: DropdownOption, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (option.disabled) return;

    this.selectedOption = option;

    this.isOpen = false;
    this.searchTerm = '';
    this.filteredOptions = [...this.options];

    this.onChange(option.value);
    this.onTouched();
    this.selectionChange.emit(option);
    this.dropdownToggle.emit(false);
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.selectedOption = null;
    this.searchTerm = '';
    this.filteredOptions = [...this.options];

    this.onChange(null);
    this.onTouched();
    this.selectionChange.emit(null);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchChange.emit(this.searchTerm);
  }

  onSearchKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isOpen = false;
      this.dropdownToggle.emit(false);
    } else if (
      event.key === 'Enter' &&
      this.allowCustomValue &&
      this.searchTerm
    ) {
      // Allow custom value entry
      const customOption: DropdownOption = {
        value: this.searchTerm,
        label: this.searchTerm,
      };
      this.selectOption(customOption, event);
    }
  }

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.searchable-dropdown');

    if (!dropdown) {
      this.isOpen = false;
      this.dropdownToggle.emit(false);
    }
  }
}
