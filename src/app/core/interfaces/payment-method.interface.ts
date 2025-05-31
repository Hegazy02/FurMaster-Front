export interface PaymentMethod {
  _id: string;
  userId: string;
  provider: string;
  methodId: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}
