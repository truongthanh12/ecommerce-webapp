export interface IUser {
  isVendor: boolean;
  email: string;
  uid: number | string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  phoneNumber: string;
  docId?: string;
  address?: string;
}
