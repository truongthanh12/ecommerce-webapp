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
}
export interface Social {
  facebook?: null | string;
  youtube?: null | string;
  twitter?: null | string;
  instagram?: null | string;
}
export interface IUser {
  id: string | number;
  email?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  dateOfBirth?: string;
  verified?: boolean;
  name?: NameUser;
}
export interface NameUser {
  name?: string;
  firstName?: string;
  lastName?: string;
}
export interface IProducts {
  id?: string | number;
  slug?: string;
  title: string;
  brands?: string | null;
  price?: number;
  sizes?: string[] | null;
  colors?: string[] | null;
  discount?: number;
  thumbnail?: string;
  images?: string[] | undefined;
  categories?: string[] | null;
  status?: string | null;
  reviews?: any;
  rating?: number;
  type?: string;
  shop?: IShop;
  published?: boolean;
  description: string;
  indexOfImages?: number;
  stock?: number | string;
}
