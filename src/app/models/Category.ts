export interface ICategory {
  stock: string;
  type: string;
  id: string;
  name: string;
  icon: null;
  slug: string;
  image: string;
  description: string | null;
  parent: string;
  published: boolean;
  userId: string;
}
