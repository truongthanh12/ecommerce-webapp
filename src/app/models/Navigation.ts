export interface INavigation {
  id?: string | number;
  icon?: any;
  title?: string;
  href?: string;
  menuComponent?: string;
  menuData?: MenuData;
}

interface MenuData {
  categories?: Category[];
  rightImage?: RightImage;
}

interface Category {
  title?: string;
  href?: string;
  subCategories?: SubCategory[];
}

interface SubCategory {
  title?: string;
  href?: string;
  imgUrl?: string;
}

interface RightImage {
  imgUrl?: string;
  href?: string;
}
