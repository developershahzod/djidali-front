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

export interface Tour {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  duration: number;
  dates: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  badge?: 'author' | 'sponsored' | 'recommended' | 'excursion';
  guide?: {
    name: string;
    avatar: string;
  };
  participants?: number;
  maxParticipants?: number;
  category: string;
  subcategory?: string;
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