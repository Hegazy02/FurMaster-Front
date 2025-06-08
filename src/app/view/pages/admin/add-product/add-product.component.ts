import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryFormInputComponent } from '../../user/my-account/pages/account-details/account-details-form/primary-form-input/primary-form-input.component';
import { PrimaryDropDownComponent } from '../../../../shared/primary-drop-down/primary-drop-down.component';
import { NgClass } from '@angular/common';
import { ColorSelectorComponent } from './color-selector/color-selector.component';
import { Color } from '../../../../core/interfaces/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimaryFormInputComponent,
    PrimaryDropDownComponent,
    NgClass,
    ColorSelectorComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  fb = inject(FormBuilder);
  addProductForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]+'),
    ]),
    offerPrice: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]+'),
    ]),
    categoryId: new FormControl('', [Validators.required]),
    colors: new FormArray([]),
  });
  categories = [
    {
      apiValue: '1',
      title: 'category1',
    },
  ];
  selectedCategory = {
    title: '',
    apiValue: '',
  };
  colors: Color[] = [{ _id: '1', name: 'Red', hex: '#FF0000' }];
  selectedProductColors: {
    colorId: string;
    stock: number;
    image: File | null;
  }[] = [];
  ngOnInit() {
    this.addColorVariant();
  }
  onColorSelected(color: Color) {
    if (
      this.selectedProductColors.some(
        (selectedColor) => selectedColor.colorId === color._id
      )
    ) {
      return;
    }
    this.selectedProductColors.push({
      colorId: color._id || '',
      stock: 0,
      image: null,
    });
  }
  getFormControl(
    name: 'title' | 'description' | 'price' | 'offerPrice'
  ): FormControl {
    return this.addProductForm.controls[name] as FormControl;
  }
  isInvalid(control: AbstractControl): boolean {
    const data = control.invalid && control.touched;
    return data;
  }
  onSelectCategory(data: { title: string; apiValue: string }) {
    this.selectedCategory = data;
    this.addProductForm.get('categoryId')?.setValue(data.apiValue);
  }
  createColorFormGroup(): FormGroup {
    return this.fb.group({
      colorId: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: [null as File | null],
    });
  }
  get colorsArray(): FormArray {
    return this.addProductForm.get('colors') as FormArray;
  }
  addColorVariant() {
    const colorGroup = this.createColorFormGroup();
    this.colorsArray.push(colorGroup);
  }

  // Remove a color variant
  removeColorVariant(index: number) {
    if (this.colorsArray.length > 1) {
      this.colorsArray.removeAt(index);
    }
  }
  onSubmit() {
    if (this.addProductForm.valid) {
      console.log(this.addProductForm.value);
    }
  }
}
