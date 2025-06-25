import { Category } from './product.model';

export interface AdminProduct {
  _id: string;
  title: string;
  price: number;
  offerPrice?: number;
  image?: string;
  description: string;
  category: Category;
  ratingCounter: number;
  rating: number;
  colors: AdminProductVariant[];
}

export interface AdminProductVariant {
  _id: string;
  colorId: string;
  name: string;
  hex?: string;
  stock: number;
  image?: string;
}
export interface AddProduct {
  title: string;
  price: number;
  offerPrice?: number;
  description: string;
  categoryId: string;
  colors: AddProductVariant[];
}
export interface AddProductVariant {
  colorId: string;
  stock: number;
  image: File;
}
export interface VariantColor {
  _id?: string;
  colorId: string;
  name: string;
  hex: string;
}
