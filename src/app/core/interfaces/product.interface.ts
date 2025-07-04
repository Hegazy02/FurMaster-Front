import { Category } from "./category.interface";

export interface Product {
  _id: string;
  title: string;
  description?: string;
  category: Category
  ratingCounter: number;
  rating: number;
  price: number;
  offerPrice?: number;
  createdAt: Date;
  colors: ProductColor[];
}

export interface ProductColor {
  _id: string;
  colorId: string | { hex: string, name: string }
  name: string;
  hex?: string;
  stock: number;
  image?: string;
}


export interface ProductQueryParams {
  key?: string;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string[];
  colorId?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'popularity';
  limit: number
}