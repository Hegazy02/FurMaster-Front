export interface Order {
  _id: string;
  sessionId: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
  status: string;
  cardLast4?: string;
  cardBrand?: string;
  products: {
    name: string;
    quantity: number;
    totalPrice: number;
    productId: string;
    variantId: string;
    _id: string;
      image?: string;  

  }[];
  createdAt: string;
}
