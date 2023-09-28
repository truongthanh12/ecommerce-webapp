import { IUser } from "./User";

export interface IShop {
  id: string | number;
  slug?: string;
  email?: string;
  displayName?: string;
  phone?: string;
  address?: string;
  verified?: boolean;
  coverPicture?: string;
  profilePicture?: string;
  socialLinks?: Social;
  user?: IUser;
  userType: string;
}
export interface Social {
  facebook?: null | string;
  youtube?: null | string;
  twitter?: null | string;
  instagram?: null | string;
}
// export interface IUser {
//   id: string;
//   email?: string;
//   phone?: string;
//   avatar?: string;
//   password?: string;
//   dateOfBirth?: string;
//   verified?: boolean;
//   name?: NameUser;
//   displayName: string;
// }
export interface NameUser {
  name?: string;
  firstName?: string;
  lastName?: string;
}
export interface IComments {
  id: string;
  user: Partial<IUser>;
  comment: string;
  rating: number;
  createdAt: any;
  updatedAt: any;
}
export interface IProducts {
  id: string;
  slug?: string;
  title: string;
  brands?: string | null;
  price?: number;
  sizes?: string[] | null;
  colors?: string[] | null;
  discount?: number;
  thumbnail?: string;
  images?: string[] | undefined;
  categories?: string | null;
  status?: string | null;
  reviews?: any;
  rating?: number;
  type?: string;
  shop?: IShop;
  published: boolean;
  description: string;
  indexOfImages?: number;
  stock?: string;
  quantity: number;
  size: string;
  color: string;
  voucherSelected: number;
  comments: Partial<IComments[]>;
}
