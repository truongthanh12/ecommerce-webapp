// import "server-only";
import { Locale } from "./next-i18next.config";
interface Dictionary {
  HOME: string;
  CART: string;
  CHECKOUT: string;
  PRODUCTS: string;
  PRODUCT_DETAIL: string;
  ORDERS: string;
  ORDER_DETAIL: string;
  SHOPS: string;
  SHOP_DETAIL: string;
  PROMOTION: string;
  ORDER_COMPLETE: string;
  PROFILE: string;
  WISHLIST: string;
  RESET_PASS: string;
  SIGN_IN: string;
  SIGN_UP: string;
  NOT_FOUND: string;
  ADMIN: string;
  BANNERS: string;
  BRANDS: string;
  CATE: string;
  CUSTOMER: string;
  SELLER: string;
  SETTING: string;
  DASHBOARD: string;
  PRODUCTS_ADMIN: string;
  VOUCHERS: string;
}

export const DICTIONARY: Dictionary = {
  HOME: "HOME",
  CART: "CART",
  CHECKOUT: "CHECKOUT",
  PRODUCTS: "PRODUCTS",
  PRODUCT_DETAIL: "PRODUCT_DETAIL",
  ORDERS: "ORDERS",
  ORDER_DETAIL: "ORDER_DETAIL",
  SHOPS: "SHOPS",
  SHOP_DETAIL: "SHOP_DETAIL",
  PROMOTION: "PROMOTION",
  ORDER_COMPLETE: "ORDER_COMPLETE",
  PROFILE: "PROFILE",
  WISHLIST: "WISHLIST",
  RESET_PASS: "RESET_PASS",
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
  NOT_FOUND: "NOT_FOUND",
  ADMIN: "ADMIN",
  BANNERS: "BANNERS",
  BRANDS: "BRANDS",
  CATE: "CATE",
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  SETTING: "SETTING",
  DASHBOARD: "DASHBOARD",
  PRODUCTS_ADMIN: "PRODUCTS_ADMIN",
  VOUCHERS: "VOUCHERS",
};
// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries: any = {
  en: () =>
    import("@/app/dictionaries/en.json").then((module) => module.default),
  vi: () =>
    import("@/app/dictionaries/vi.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
