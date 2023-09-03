export interface ICategory {
  type: string;
  id: string;
  name: string;
  icon: null;
  slug: string;
  image: string;
  description: string | null;
  parent: never[];
}
