import { IProducts } from "./Product";

export interface IOrder {
  cartList: ICart[];
  orders: ICart[];
  email: string;
  isInCity: boolean;
  name: string;
  note: string;
  phone: number;
  userId: string;
  total: number;
  id: string;
  address: string;
  status: string;
  createdAt: {
    seconds?: number;
    nanoseconds?: number;
  };
}
export interface ICart {
  product: IProducts;
  color: string;
  size: string;
  quantity: number;
  stock: number;
  voucherSelected: number;
  userId: string;
}
