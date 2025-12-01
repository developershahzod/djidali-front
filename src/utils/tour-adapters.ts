import {
  Tour,
  ApiTourResponse,
  LaravelTourResponse,
  LegacyTour,
  TourPrice,
  TourImage,
  MultilingualText,
  TourCategory
} from '../types/tour.types';

export function adaptApiTourToTour(apiTour: ApiTourResponse, currentLang: string = 'eng'): Tour {
  const title: MultilingualText & { default?: string } = {
    uz: apiTour.titleUz,
    ru: apiTour.titleRu,
    eng: apiTour.titleEng,
    de: apiTour.titleDe,
    default: apiTour.title
  };

  const description: MultilingualText & { default?: string } = {
    uz: apiTour.descriptionUz,
    ru: apiTour.descriptionRu,
    eng: apiTour.descriptionEng,
    de: apiTour.descriptionDe,
    default: apiTour.description
  };

  const price: TourPrice = typeof apiTour.price === 'object'
    ? apiTour.price
    : { amount: apiTour.price, currency: apiTour.currency || 'UZS' };

  const images: TourImage[] = apiTour.images.map((url, index) => ({
    url,
    isPrimary: index === 0
  }));

  const inclusions: MultilingualText[] = Array.isArray(apiTour.inclusions)
    ? apiTour.inclusions.map(item => {
        if (typeof item === 'string') {
          return { [currentLang]: item };
        }
        return item as MultilingualText;
      })
    : [];

  const exclusions: MultilingualText[] = Array.isArray(apiTour.exclusions)
    ? apiTour.exclusions.map(item => {
        if (typeof item === 'string') {
          return { [currentLang]: item };
        }
        return item as MultilingualText;
      })
    : [];

  const category: TourCategory | undefined = apiTour.category
    ? {
        id: apiTour.category.id,
        name: apiTour.category.name,
        nameUz: apiTour.category.nameUz,
        nameRu: apiTour.category.nameRu,
        nameEng: apiTour.category.nameEng,
        nameDe: apiTour.category.nameDe
      }
    : undefined;

  return {
    id: apiTour.id,
    uuid: apiTour.uuid,
    title,
    description,
    destination: apiTour.destination,
    duration: apiTour.duration,
    price,
    maxParticipants: apiTour.maxParticipants,
    startDate: apiTour.startDate,
    endDate: apiTour.endDate,
    images,
    inclusions,
    exclusions,
    status: apiTour.status,
    isHidden: apiTour.isHidden,
    category,
    categoryId: apiTour.categoryId,
    rating: apiTour.rating,
    reviewCount: apiTour.reviewCount,
    createdAt: apiTour.createdAt,
    updatedAt: apiTour.updatedAt
  };
}

export function adaptLaravelTourToTour(laravelTour: LaravelTourResponse, currentLang: string = 'eng'): Tour {
  const title: MultilingualText & { default?: string } = {
    default: laravelTour.title,
    [currentLang]: laravelTour.title
  };

  const description: MultilingualText & { default?: string } = {
    default: laravelTour.description,
    [currentLang]: laravelTour.description
  };

  const price: TourPrice = {
    amount: laravelTour.price,
    currency: 'UZS'
  };

  const images: TourImage[] = laravelTour.images
    ? laravelTour.images.map((img, index) => ({
        id: img.id.toString(),
        url: img.url,
        isPrimary: index === 0
      }))
    : [];

  const startDate = laravelTour.dates?.[0]?.start_date || laravelTour.created_at;
  const endDate = laravelTour.dates?.[0]?.end_date || laravelTour.created_at;

  const category: TourCategory | undefined = laravelTour.category
    ? {
        id: laravelTour.category.id.toString(),
        name: laravelTour.category.name
      }
    : undefined;

  return {
    id: laravelTour.id.toString(),
    title,
    description,
    destination: laravelTour.location,
    duration: laravelTour.duration,
    price,
    maxParticipants: laravelTour.max_participants,
    currentParticipants: laravelTour.current_participants,
    startDate,
    endDate,
    images,
    inclusions: [],
    exclusions: [],
    status: laravelTour.is_active ? 'ACTIVE' : 'INACTIVE',
    isHidden: false,
    category,
    categoryId: laravelTour.category_id?.toString(),
    rating: laravelTour.rating,
    reviewCount: laravelTour.reviews_count,
    createdAt: laravelTour.created_at,
    updatedAt: laravelTour.updated_at
  };
}

export function adaptTourToLegacy(tour: Tour, currentLang: string = 'eng'): LegacyTour {
  const getLocalizedValue = (text: MultilingualText & { default?: string }): string => {
    return text[currentLang as keyof MultilingualText] || text.default || '';
  };

  const primaryImage = tour.images.find(img => img.isPrimary) || tour.images[0];

  return {
    id: tour.id,
    title: getLocalizedValue(tour.title),
    image: primaryImage?.url || '',
    rating: tour.rating || 0,
    reviewCount: tour.reviewCount || 0,
    location: tour.destination,
    duration: tour.duration,
    dates: `${tour.startDate} - ${tour.endDate}`,
    price: tour.price.amount,
    maxParticipants: tour.maxParticipants,
    participants: tour.currentParticipants,
    category: tour.category?.name || '',
    subcategory: undefined
  };
}

export function getLocalizedTourTitle(tour: Tour, lang: string): string {
  return tour.title[lang as keyof MultilingualText] || tour.title.default || '';
}

export function getLocalizedTourDescription(tour: Tour, lang: string): string {
  return tour.description[lang as keyof MultilingualText] || tour.description.default || '';
}

export function getTourPrimaryImage(tour: Tour): string {
  const primary = tour.images.find(img => img.isPrimary);
  return primary?.url || tour.images[0]?.url || '';
}

export function formatTourPrice(price: TourPrice, locale: string = 'en-US'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formatter.format(price.amount);
}

export function isTourAvailable(tour: Tour): boolean {
  return (
    tour.status === 'ACTIVE' &&
    !tour.isHidden &&
    (tour.currentParticipants || 0) < tour.maxParticipants
  );
}

export function getTourAvailableSpots(tour: Tour): number {
  return tour.maxParticipants - (tour.currentParticipants || 0);
}
