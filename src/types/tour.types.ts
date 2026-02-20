export interface MultilingualText {
  uz?: string;
  ru?: string;
  eng?: string;
  de?: string;
}

export interface TourPrice {
  amount: number;
  currency: string;
}

export interface TourCategory {
  id: string;
  name: string;
  nameUz?: string;
  nameRu?: string;
  nameEng?: string;
  nameDe?: string;
  slug?: string;
}

export interface TourItineraryDay {
  dayNumber: number;
  title: MultilingualText;
  description: MultilingualText;
}

export interface TourImage {
  id?: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface Tour {
  id: string;
  uuid?: string;

  title: MultilingualText & { default?: string };
  description: MultilingualText & { default?: string };

  destination: string;
  duration: number;

  price: TourPrice;

  maxParticipants: number;
  currentParticipants?: number;

  startDate: string;
  endDate: string;

  images: TourImage[];

  itinerary?: TourItineraryDay[];
  inclusions: MultilingualText[];
  exclusions: MultilingualText[];

  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED" | "FULLY_BOOKED";
  isHidden: boolean;

  category?: TourCategory;
  categoryId?: string;

  rating?: number;
  reviewCount?: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface LegacyTour {
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
  badge?: "author" | "sponsored" | "recommended" | "excursion";
  guide?: {
    name: string;
    avatar: string;
  };
  participants?: number;
  maxParticipants?: number;
  category: string;
  subcategory?: string;
}

export interface ApiTourResponse {
  id: string;
  uuid?: string;
  title: string;
  titleUz?: string;
  titleRu?: string;
  titleEng?: string;
  titleDe?: string;
  description: string;
  descriptionUz?: string;
  descriptionRu?: string;
  descriptionEng?: string;
  descriptionDe?: string;
  destination: string;
  regions?: string[];
  latitude?: number | null;
  longitude?: number | null;
  duration: number;
  price: number | { amount: number; currency: string };
  currency: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  images: string[];
  itinerary?: Record<string, any>;
  inclusions: any[];
  exclusions: any[];
  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED" | "FULLY_BOOKED";
  isHidden: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    nameUz?: string;
    nameRu?: string;
    nameEng?: string;
    nameDe?: string;
  };
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LaravelTourResponse {
  id: string | number;
  title: string;
  description: string;
  short_description?: string;
  price: number;
  currency?: string;
  duration: number;
  max_participants: number;
  current_participants?: number;
  location: string;
  destination?: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
  images?: Array<{
    id: number;
    url: string;
  }>;
  dates?: Array<{
    id: number;
    start_date: string;
    end_date: string;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  rating?: number;
  reviews_count?: number;
  // Coordinates for map display
  latitude?: number | null;
  longitude?: number | null;
}
