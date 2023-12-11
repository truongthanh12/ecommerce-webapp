export interface IShop {
  id?: string;
  uid?: string;
  slug?: string;
  user?: User;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  address?: string;
  verified?: boolean;
  pictureCover?: string;
  photoURL?: string;
  rating?: number;
  facebook: string;
  youtube: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
  dateOfBirth: string;
  verified: boolean;
  displayName?: string;
}
