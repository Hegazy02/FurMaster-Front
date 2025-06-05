export interface Product {
      image?: string;

  _id?: string;
  name: string;
  description: string;
  categoryId: string | Category;
  ratingCounter?: number;
  rating?: number;
  price?: number;
  offerPrice?: number;

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
