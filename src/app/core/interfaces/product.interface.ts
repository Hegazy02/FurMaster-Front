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
  colorId: string;
  name: string;
  hex?: string;
  stock: number;
  image?: string;
}


// API query parameters
export interface ProductQueryParams {
  key?: string;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string[];
  colorId?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'popularity';
}