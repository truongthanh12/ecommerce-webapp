export interface IBrand {
  id: string;
  slug: string;
  name: string;
  image?: string;
  type?: string;
  for?: TypeBrand;
}
interface TypeBrand {
  demo?: string;
  type?: string;
}
