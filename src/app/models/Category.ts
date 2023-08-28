export interface ICategory {
  id?: string;
  name?: string;
  icon?: null;
  slug?: string;
  image?: string;
  description?: string | null;
  parent?: never[];
  for?: Type;
}

export interface Type {
  demo?: string;
  type?: string;
}
