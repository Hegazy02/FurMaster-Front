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
import { ColorsService } from '../../../../core/services/colors.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  DropdownOption,
  SearchableDropdownComponent,
} from './searchable-dropdown/searchable-dropdown.component';
import { CategoriesService } from '../../../../core/services/categories.service';
import { PrimaryButtonComponent } from '../../../../shared/primary-button/primary-button.component';
import { ProductsService } from '../../../../core/services/products.service';
import {
  AddProduct,
  AdminProduct,
  AdminProductVariant,
  VariantColor,
} from '../../../../core/interfaces/admin-product.interface';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

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
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  colorsSerice = inject(ColorsService);
  categoriesService = inject(CategoriesService);
  productsService = inject(ProductsService);
  addProductForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    offerPrice: new FormControl('', [Validators.min(0)]),
    categoryId: new FormControl('', [Validators.required]),
    colors: new FormArray([]),
  });
  categories: DropdownOption[] = [];
  colors: VariantColor[] = [];
  imagePreviewUrls: string[] = [];
  categorySearchInput = new Subject<string>();
  private readonly activatedRoute = inject(ActivatedRoute);
  productId: string | null = null;
  initialCategory: DropdownOption | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.getProduct();
    this.getColors();
    this.getCategories();
    this.addColorVariant();
    this.subScribeToCategorySearchInput();
  }
  getProduct() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((param) => {
        this.productId = param.get('id');
        if (!this.productId) {
          return;
        }

        this.productsService
          .getProduct(this.productId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (result) => {
              
              this.setProductData(result.data);
            },
          });
      });
  }
  private setProductData(data: AdminProduct) {
    this.initialCategory = {
      label: data.category.name,
      value: data.category._id,
    };
    this.addProductForm.patchValue({
      title: data.title,
      description: data.description,
      price: data.price.toString(),
      offerPrice: data.offerPrice?.toString(),
      categoryId: data.category._id,
    });

    this.colorsArray.clear();
    data.colors.forEach((color) => {
      this.colorsArray.push(this.createColorFormGroup(color));
      color.image && this.imagePreviewUrls.push(color.image);
    });
  }

  getColors() {
    this.colorsSerice
      .getColors()
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.colors = result.data.map((color) => {
          return {
            colorId: color._id,
            name: color.name,
            hex: color.hex,
          };
        });
      });
  }
  onColorSelected(color: VariantColor, index: number) {
    this.colorsArray.controls[index].get('colorId')?.setValue(color.colorId);
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
  createColorFormGroup(color?: AdminProductVariant): FormGroup {
    return this.fb.group({
      _id: color?._id,
      idForHtml: crypto.randomUUID(),
      colorId: [color?.colorId ?? '', [Validators.required]],
      stock: [
        color?.stock ?? '',
        [Validators.required, Validators.min(0), Validators.pattern('[0-9]+')],
      ],
      image: [
        color?.image ?? (null as File | null | string),
        [Validators.required],
      ],
    });
  }
  trackByVariantId(item: AbstractControl): string {
    return item.get('idForHtml')?.value;
  }
  get colorsArray(): FormArray {
    return this.addProductForm.get('colors') as FormArray;
  }
  addColorVariant() {
    const colorGroup = this.createColorFormGroup();
    this.colorsArray.push(colorGroup);
  }

  removeVariant(index: number) {
    if (this.colorsArray.controls[index].get('_id')?.value) {
      this.deleteProductVariant(index);
    }
    if (this.colorsArray.length > 1) {
      this.colorsArray.removeAt(index);
      this.imagePreviewUrls.splice(index, 1);
    }
  }
  setVariant(index: number) {
    if (!this.colorsArray.controls[index].valid) {
      this.colorsArray.controls[index].markAllAsTouched();
      this.markAllAsDirty();
      return;
    }
    const variantId = this.colorsArray.controls[index].get('_id')?.value;
    if (variantId) {
      this.updateProductVariant(index);
    } else {
      this.addProductVariant(index);
    }
  }
  addProductVariant(index: number) {
    this.productsService
      .addProductVariant(this.productId!, this.getColorGroup(index).value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.toastr.success('Variant added successfully');
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          console.error(err);
        },
      });
  }
  updateProductVariant(index: number) {
    this.productsService
      .updateProductVariant(this.productId!, this.getColorGroup(index).value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.toastr.success('Variant updated successfully');
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          console.error(err);
        },
      });
  }
  deleteProductVariant(index: number) {
    
    this.productsService
      .deleteProductVariant(
        this.productId!,
        this.getColorGroup(index).value._id!
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.toastr.success('Variant deleted successfully');
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          console.error(err);
        },
      });
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
    if (!this.addProductForm.valid) {
      this.addProductForm.markAllAsTouched();
      this.markAllAsDirty();
      this.toastr.error('Please fill all the required fields');
    }
    const productData = this.parseForm();
    if (this.productId) {
      this.updateProduct(productData);
    } else {
      this.addProduct(productData);
    }
  }
  addProduct(productData: AddProduct) {
    this.productsService
      .addProduct(productData)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.toastr.success('Product added successfully');
          this.resetData();
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          console.error(err);
        },
      });
  }
  updateProduct(productData: AddProduct) {
    this.productsService
      .updateProduct(this.productId!, productData)
      ?.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.toastr.success('Product updated successfully');
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          console.error(err);
        },
      });
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
  getInitialColor(color: AbstractControl) {
    return (
      this.colors.find((c) => c.colorId === color.get('colorId')?.value) || null
    );
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
}
