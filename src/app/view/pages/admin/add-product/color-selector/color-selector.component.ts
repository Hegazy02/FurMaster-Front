// color-selector.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Color } from '../../../../../core/interfaces/product.model';

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
export class ColorSelectorComponent implements ControlValueAccessor {
  @Input() colors: Color[] = [
    {
      _id: '1',
      name: 'Red',
      hex: '#FF0000',
    },
    {
      _id: '2',
      name: 'Green',
      hex: '#00FF00',
    },
    {
      _id: '3',
      name: 'Blue',
      hex: '#0000FF',
    },
  ];
  @Input() label: string = '';
  @Input() isInvalid: boolean = false;
  @Input() disabled: boolean = false;
  @Output() colorSelected = new EventEmitter<Color>();

  selectedColorId: string | null = null;
  selectedColor: Color | null = null;
  dropdownId: string = `color-dropdown-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  isOpen: boolean = false;
  highlightedIndex: number = -1;

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  public onTouched = () => {};

  constructor(private elementRef: ElementRef) {}

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

  selectColor(color: Color) {
    if (this.disabled) return;

    this.selectedColorId = color._id;
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

// Example usage in parent component:
/*
// parent.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export class ParentComponent {
  availableColors: Color[] = [
    { id: '1', name: 'Crimson Red', hexCode: '#dc143c' },
    { id: '2', name: 'Ocean Blue', hexCode: '#006994' },
    { id: '3', name: 'Forest Green', hexCode: '#228b22' },
    { id: '4', name: 'Sunshine Yellow', hexCode: '#ffd700' },
    { id: '5', name: 'Royal Purple', hexCode: '#663399' },
    { id: '6', name: 'Hot Pink', hexCode: '#ff1493' },
    { id: '7', name: 'Burnt Orange', hexCode: '#cc5500' },
    { id: '8', name: 'Turquoise', hexCode: '#40e0d0' },
    { id: '9', name: 'Slate Gray', hexCode: '#708090' },
    { id: '10', name: 'Midnight Black', hexCode: '#000000' },
    { id: '11', name: 'Pure White', hexCode: '#ffffff' },
    { id: '12', name: 'Chocolate Brown', hexCode: '#8b4513' }
  ];

  productForm = new FormGroup({
    colorId: new FormControl('', [Validators.required])
  });

  onColorSelected(color: Color) {
    console.log('Selected color:', color);
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form submitted with color:', this.productForm.value.colorId);
    } else {
      console.log('Form is invalid');
      this.productForm.markAllAsTouched();
    }
  }
}

// parent.component.html
<form [formGroup]="productForm" (ngSubmit)="onSubmit()">
  <app-color-selector
    [colors]="availableColors"
    [label]="'Select Product Color'"
    [isInvalid]="productForm.get('colorId')?.invalid && productForm.get('colorId')?.touched"
    formControlName="colorId"
    (colorSelected)="onColorSelected($event)">
  </app-color-selector>
  
  <button type="submit" class="btn btn-primary">
    Submit
  </button>
</form>
*/
