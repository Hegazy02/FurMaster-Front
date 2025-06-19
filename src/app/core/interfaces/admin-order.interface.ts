export interface AdminOrder {
  _id: string;
  number: number;
  customer: string;
  amountTotal: number;
  status: string;
  paid: boolean;
  createdAt: Date;
}
