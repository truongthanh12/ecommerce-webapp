export interface IVoucher {
  name: string;
  amount: number;
  discountMax: number;
  discountPercent: number;
  totalBill: number;
  id?: string;
  userId: string;
}
