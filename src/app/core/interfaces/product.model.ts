export interface Product {
  _id?: string;
  name: string;
  price?: number;
  offerPrice?: number;
  image?: string;
  description: string;
  categoryId: string | Category;
  ratingCounter?: number;
  rating?: number;
  colors?: {
    colorId?: string | Color;
    stock?: number;
    image?: string;
  }[];
}

export interface Category {
  _id: string;
  name: string;
}

export interface Color {
  _id: string;
  name: string;
  hexCode?: string;
}
