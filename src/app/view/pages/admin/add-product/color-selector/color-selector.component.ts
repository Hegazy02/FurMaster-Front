// color-selector.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VariantColor } from '../../../../../core/interfaces/admin-product.interface';

@Component({
  selector: 'app-color-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorSelectorComponent),
      multi: true,
    },
  ],
})
export class ColorSelectorComponent implements ControlValueAccessor, OnChanges {
  @Input() colors: VariantColor[] = [];
  @Input() label: string = '';
  @Input() isInvalid: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Output() colorSelected = new EventEmitter<VariantColor>();

  selectedColorId: string | null = null;
  @Input() selectedColor: VariantColor | null = null;
  dropdownId: string = `color-dropdown-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  isOpen: boolean = false;
  highlightedIndex: number = -1;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  public onTouched = () => {};

  constructor(private elementRef: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedColor) {
      this.selectedColorId = this.selectedColor.colorId;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    if (this.disabled) return;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.isOpen = true;
    this.highlightedIndex = this.selectedColorId
      ? this.colors.findIndex((c) => c._id === this.selectedColorId)
      : -1;
  }

  closeDropdown() {
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.onTouched();
  }

  selectColor(color: VariantColor) {
    if (this.disabled) return;

    this.selectedColorId = color.colorId;
    this.selectedColor = color;
    this.onChange(color._id);
    this.colorSelected.emit(color);
    this.closeDropdown();
  }

  onKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else if (this.highlightedIndex >= 0) {
          this.selectColor(this.colors[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.highlightedIndex = Math.min(
            this.highlightedIndex + 1,
            this.colors.length - 1
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        }
        break;
    }
  }

  // ControlValueAccessor methods
  writeValue(colorId: string): void {
    this.selectedColorId = colorId;
    this.selectedColor = this.colors.find((c) => c._id === colorId) || null;
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
}

