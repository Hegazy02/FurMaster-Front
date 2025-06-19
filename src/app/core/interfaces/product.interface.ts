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
<<<<<<< HEAD
  categoryId?: string[];
  colorId?: string[];
=======
  categoryId?: string;
  colorId?: string;
>>>>>>> 7f615970c190a93d77325cf0e0de3fe6f0bd0a00
  sortBy?: 'price_asc' | 'price_desc' | 'popularity';
}