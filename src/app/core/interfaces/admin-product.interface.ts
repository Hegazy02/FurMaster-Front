import { Category, Color } from './product.model';

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
  colors: AdminProductColor[];
}

export interface AdminProductColor {
  _id: string;
  name: string;
  hex?: string;
  stock: number;
  image?: string;
}
