export interface IBrand {
  id: string;
  slug: string;
  name: string;
  image?: string;
  type?: string;
  published: boolean;
  userId: string;
}

export interface ICarouselCard {
  id: string;
  title?: string;
  imgUrl?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  type?: string;
  published: boolean;
  userId: string;
}
