export interface Category {
  _id: string;
  name: string;
  image?: string;
}

export interface CategoryListResponse {
  success: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  data: Category[];
}

export interface CategoryDetailResponse {
  success: boolean;
  data: Category;
}

export interface CategoryProductsResponse {
  success: boolean;
  data: CategoryProduct[];
}

export interface CategoryProduct {
  _id: string;
  title: string;
  description: string;
  categoryId: Category;
  ratingCounter: number;
  rating: number;
  price: number;
  offerPrice?: number;
  colors: CategoryProductColor[];
  createdAt: string;
  isDeleted?: boolean;
  __v?: number;
}

export interface CategoryProductColor {
  colorId: string;
  stock: number;
  image: string;
  isDeleted?: string | null;
  _id: string;
}

export interface CategoryQueryParams {
  page?: number;
  search?: string;
}