export type Property = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  currency: 'USD' | 'EUR' | 'RUB';
  coverImage: string;
};
