export * from './tour.types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface FilterState {
  category: string;
  subcategory: string;
  priceRange: [number, number];
  duration: [number, number];
  rating: number;
  language: string[];
  discountOnly: boolean;
  guaranteedOnly: boolean;
}