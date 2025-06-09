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
import { NgClass } from '@angular/common';
import { ColorSelectorComponent } from './color-selector/color-selector.component';
import { Color } from '../../../../core/interfaces/product.model';
import { ColorsService } from '../../../../core/services/colors.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  DropdownOption,
  SearchableDropdownComponent,
} from './searchable-dropdown/searchable-dropdown.component';
import { CategoriesService } from '../../../../core/services/categories.service';
import { PrimaryButtonComponent } from '../../../../shared/primary-button/primary-button.component';
import { ProductsService } from '../../../../core/services/products.service';
import { AddProduct } from '../../../../core/interfaces/admin-product.interface';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimaryFormInputComponent,
    NgClass,
    ColorSelectorComponent,
    SearchableDropdownComponent,
    PrimaryButtonComponent,
  ],
  imports: [
    ReactiveFormsModule,
    PrimaryFormInputComponent,
    NgClass,
    ColorSelectorComponent,
    SearchableDropdownComponent,
    PrimaryButtonComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  fb = inject(FormBuilder);
  colorsSerice = inject(ColorsService);
  categoriesService = inject(CategoriesService);
  productsService = inject(ProductsService);
  addProductForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(500),
    ]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    offerPrice: new FormControl('', [Validators.min(0)]),
    categoryId: new FormControl('', [Validators.required]),
    colors: new FormArray([]),
  });
  categories: DropdownOption[] = [];
  colors: Color[] = [{ _id: '1', name: 'Red', hex: '#FF0000' }];
  imagePreviewUrls: string[] = [];
  categorySearchInput = new Subject<string>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.getColors();
    this.getCategories();
    this.addColorVariant();
    this.subScribeToCategorySearchInput();
  }
  getColors() {
    this.colorsSerice
      .getColors()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.colors = result.data;
      });
  }
  onColorSelected(color: Color, index: number) {
    this.colorsArray.controls[index].get('colorId')?.setValue(color._id);
  }
  getFormControl(
    name: 'title' | 'description' | 'price' | 'offerPrice' | 'categoryId'
  ): FormControl {
    return this.addProductForm.controls[name] as FormControl;
  }
  isInvalid(control: AbstractControl): boolean {
    const data = control.invalid && control.touched && control.dirty;
    return data;
  }
  onSelectCategory(data: DropdownOption) {
    this.addProductForm.get('categoryId')?.setValue(data.value);
  }
  createColorFormGroup(): FormGroup {
    return this.fb.group({
      id: crypto.randomUUID(),
      colorId: ['', [Validators.required]],
      stock: [
        '',
        [Validators.required, Validators.min(0), Validators.pattern('[0-9]+')],
      ],
      image: [null as File | null, [Validators.required]],
    });
  }
  trackByVariantId(item: AbstractControl): string {
    return item.get('id')?.value;
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
      this.imagePreviewUrls.splice(index, 1);
    }
  }
  getColorGroup(index: number): FormGroup {
    return this.colorsArray.at(index) as FormGroup;
  }

  markAllAsDirty() {
    Object.keys(this.addProductForm.controls).forEach((key) => {
      const control = this.addProductForm.get(key);
      control?.markAsDirty();
    });
    this.markAllColorsAsDirty();
  }
  private markAllColorsAsDirty() {
    const colorsControls = this.colorsArray.controls;
    for (let i = 0; i < colorsControls.length; i++) {
      const colorGroup = this.getColorGroup(i);
      Object.keys(colorGroup.controls).forEach((key) => {
        const control = colorGroup.get(key);
        control?.markAsDirty();
      });
    }
  }

  isVariantControlInvalid(index: number, controlName: string): boolean {
    return (
      this.getColorGroup(index).get(controlName)!.invalid &&
      this.getColorGroup(index).get(controlName)!.touched &&
      this.getColorGroup(index).get(controlName)!.dirty
    );
  }
  onSelectFile(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.getColorGroup(index).get('image')?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls[index] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  subScribeToCategorySearchInput() {
    this.categorySearchInput
      .pipe(debounceTime(1000))
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => this.getCategories(name));
  }
  getCategories(name: string = '') {
    this.categoriesService
      .getCategories(name)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.categories = result.data.map((category) => ({
            label: category.name,
            value: category._id,
          }));
        },
        error: (error) => {
          if (error.status === 404) {
            this.categories = [];
          }
        },
      });
  }
  onSearchCategory(name: string) {
    this.categorySearchInput.next(name);
  }
  onSubmit() {
    if (this.addProductForm.valid) {
      const addProductData: AddProduct = this.parseForm();
      this.productsService
        .addProduct(addProductData)
        ?.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.resetData();
          
          },
          error: (err) => console.error(err),
        });
    } else {
      this.addProductForm.markAllAsTouched();
      this.markAllAsDirty();
    }
  }
  private resetData() {
    this.addProductForm.reset();
    this.imagePreviewUrls = [];
    this.colorsArray.clear();
    this.addColorVariant();
  }

  private parseForm(): AddProduct {
    return {
      title: this.addProductForm.value.title!,
      description: this.addProductForm.value.description!,
      price: parseFloat(this.addProductForm.value.price!),
      offerPrice: this.addProductForm.value.offerPrice
        ? parseFloat(this.addProductForm.value.offerPrice)
        : undefined,
      categoryId: this.addProductForm.value.categoryId!,
      colors: this.addProductForm.value.colors!,
    };
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
}
