import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryFormInputComponent } from '../../../../shared/primary-form-input/primary-form-input.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, PrimaryFormInputComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
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
    colors: new FormGroup({
      colorId: new FormControl('', [Validators.required]),
      stock: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    }),
  });
  getFormControl(
    name: 'title' | 'description' | 'price' | 'offerPrice' | 'categoryId'
  ): FormControl {
    return this.addProductForm.controls[name] as FormControl;
  }
  isInvalid(control: AbstractControl): boolean {
    const data = control.invalid && control.touched;
    return data;
  }
  onSubmit() {
    if (this.addProductForm.valid) {
      console.log(this.addProductForm.value);
    }
  }
}
