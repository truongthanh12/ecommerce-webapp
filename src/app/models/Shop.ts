export interface IShop {
  id?: string;
  slug?: string;
  user?: User;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  verified?: boolean;
  coverPicture?: string;
  profilePicture?: string;
  rating?: number;
  socialLinks?: SocialLinks;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
  dateOfBirth: string;
  verified: boolean;
  name?: Name;
}

export interface Name {
  firstName: string;
  lastName: string;
}

export interface SocialLinks {
  facebook: any;
  youtube: any;
  twitter: any;
  instagram: any;
}
