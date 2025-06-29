

export interface CartItem {
  _id?: string;
  title: string;
  price: number;
  offerPrice?: number;
  quantity: number;
  image?: string; 
  variantId: string;
  productId: string;
    stock: number;

}

