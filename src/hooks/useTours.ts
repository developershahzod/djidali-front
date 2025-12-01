import { useState, useEffect } from 'react';
import { djidaliApi, ApiTour } from '../services/djidaliApi';
import { Tour } from '../services/api';
import { toIsoStringSafe } from '../utils/dateUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslatedText } from '../utils/translation';

interface UseToursParams {
  page?: number;
  limit?: number;
  search?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  autoFetch?: boolean;
  category_id?: number;
  categoryId?: string;
  min_price?: number;
  max_price?: number;
  duration?: number;
  per_page?: number;
  sort?: string;
  accumulate?: boolean;
  startDate?: string;
  endDate?: string;
}

interface UseToursReturn {
  tours: Tour[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  } | null;
  fetchTours: () => Promise<void>;
  refetch: () => Promise<void>;
}

// Helper function to get translated field value from separate language fields
const getTranslatedField = (obj: any, fieldPrefix: string, lang: string): string => {
  if (!obj) return '';
  
  // Map language codes to field suffixes
  const langMap: Record<string, string> = {
    'uz': 'Uz',
    'ru': 'Ru',
    'en': 'Eng',
    'eng': 'Eng',
    'de': 'De'
  };

  const suffix = langMap[lang.toLowerCase()] || 'Eng';
  const translatedField = `${fieldPrefix}${suffix}`;
  
  // Try to get the translated field value
  const value = obj[translatedField];
  
  // If not found, fallback to base field, then other languages
  if (value) return value;
  if (obj[fieldPrefix]) return obj[fieldPrefix];
  if (obj[`${fieldPrefix}Eng`]) return obj[`${fieldPrefix}Eng`];
  if (obj[`${fieldPrefix}Uz`]) return obj[`${fieldPrefix}Uz`];
  if (obj[`${fieldPrefix}Ru`]) return obj[`${fieldPrefix}Ru`];
  if (obj[`${fieldPrefix}De`]) return obj[`${fieldPrefix}De`];
  
  return '';
};

const getLocalizedText = (content: any, lang: string): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;

  // Check if this is an object with separate translation fields (titleUz, titleRu, etc)
  // This happens when content is the tour/category object itself
  if (content.titleUz !== undefined || content.nameUz !== undefined || 
      content.descriptionUz !== undefined) {
    // Determine the field prefix
    if (content.titleUz !== undefined || content.titleRu !== undefined || 
        content.titleEng !== undefined || content.titleDe !== undefined) {
      return getTranslatedField(content, 'title', lang);
    }
    if (content.nameUz !== undefined || content.nameRu !== undefined || 
        content.nameEng !== undefined || content.nameDe !== undefined) {
      return getTranslatedField(content, 'name', lang);
    }
    if (content.descriptionUz !== undefined || content.descriptionRu !== undefined || 
        content.descriptionEng !== undefined || content.descriptionDe !== undefined) {
      return getTranslatedField(content, 'description', lang);
    }
  }

  // Otherwise, treat as a translation object { uz: "...", ru: "...", en: "..." }
  const normalized = Object.entries(content).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value == null) {
      return acc;
    }

    const normalizedKey = key.toLowerCase();
    acc[normalizedKey] = String(value);

    // Normalise common aliases (eng/en)
    if (normalizedKey === 'eng') {
      acc['en'] = String(value);
    } else if (normalizedKey === 'en' && !acc['eng']) {
      acc['eng'] = String(value);
    }

    return acc;
  }, {});

  return getTranslatedText(normalized, lang.toLowerCase());
};

interface TourImage {
  id: number;
  tour_id: number;
  image_url: string;
  is_primary: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

const convertApiTourToTour = (apiTour: any, lang: string): Tour => {
  // Helper to safely convert date fields that might be strings or objects
  const safeDateConvert = (dateValue: string | Record<string, any> | undefined): string | null => {
    if (!dateValue) return null;
    if (typeof dateValue === 'string') {
      return toIsoStringSafe(dateValue as string);
    }
    // If it's an object (empty or otherwise), return null
    return null;
  };

  // Precompute safe date strings
  const nowIso = new Date().toISOString();
  const createdAtIso = safeDateConvert(apiTour.createdAt) ?? nowIso;
  const updatedAtIso = safeDateConvert(apiTour.updatedAt) ?? createdAtIso;
  const startDateIso = safeDateConvert(apiTour.startDate);
  const endDateIso = safeDateConvert(apiTour.endDate) ?? startDateIso ?? null;

  // Handle price object
  let priceValue = 0;
  const priceSource = apiTour.price;
  
  if (typeof priceSource === 'number') {
    priceValue = priceSource;
  } else if (priceSource && typeof priceSource === 'object') {
    // Try different possible price fields
    priceValue = Number((priceSource as any).amount) || 
                Number((priceSource as any).uzs) || 
                Number((priceSource as any).UZS) || 
                Number((priceSource as any).usd) || 
                Number((priceSource as any).value) || 0;
  }

  // Process images
  const images: TourImage[] = [];
  if (Array.isArray(apiTour.images)) {
    apiTour.images.forEach((url, idx) => {
      if (url) {
        images.push({
          id: idx,
          tour_id: Number(apiTour.id) || idx,
          image_url: url,
          is_primary: idx === 0,
          order: idx,
          created_at: createdAtIso,
          updated_at: updatedAtIso,
        });
      }
    });
  }

  // Process tour dates
  const tourDates = [] as Tour['dates'];
  if (startDateIso) {
    tourDates.push({
      id: Number(apiTour.id) || 0,
      tour_id: Number(apiTour.id) || 0,
      start_date: startDateIso,
      end_date: endDateIso ?? startDateIso,
      available_spots: apiTour.maxParticipants || 0,
      is_active: apiTour.status === 'ACTIVE',
      created_at: createdAtIso,
      updated_at: updatedAtIso,
    });
  }

  // Process itinerary
  const programDays = apiTour.program || apiTour.programDays || [];
  const itinerary: Tour['itinerary'] = programDays.map((item: any, idx: number) => ({
    id: item.id || idx,
    tour_id: Number(apiTour.id),
    day: item.dayNumber || idx + 1,
    title: getTranslatedField(item, 'title', lang) || item.title || `Day ${idx + 1}`,
    description: getTranslatedField(item, 'description', lang) || item.description || '',
    activities: [],
    meals: [],
    accommodation: ''
  }));

  const parseMultilingualArray = (arr: any[] | undefined): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) { // The lang code for english is 'en', but the api returns 'eng'
        return item[lang] || item.eng || item.ru || item.uz || item.de || Object.values(item)[0] || '';
      }
      return '';
    }).filter(Boolean);
  }

  // Create tour object
  return {
    id: apiTour.id,
    title: getTranslatedField(apiTour, 'title', lang) || apiTour.title,
    description: getTranslatedField(apiTour, 'description', lang) || apiTour.description,
    short_description: '', // Will be populated if available
    price: priceValue,
    duration: apiTour.duration || 1,
    max_participants: apiTour.maxParticipants || 0,
    current_participants: apiTour.orders?.reduce((sum, order) => sum + (order.participants || 0), 0) || 0,
    location: apiTour.destination || '',
    category_id: 1, // Default category ID
    category: apiTour.category ? {
      id: parseInt(apiTour.category.id) || 1,
      name: getTranslatedField(apiTour.category, 'name', lang) || apiTour.category.name,
      slug: apiTour.category.slug || 'tour',
      description: getTranslatedField(apiTour.category, 'description', lang) || apiTour.category.description || '',
      image: apiTour.category.icon,
      is_active: apiTour.category.isActive !== false,
      tours_count: 0, // Will be populated by the API
      created_at: safeDateConvert(apiTour.category.createdAt) ?? createdAtIso,
      updated_at: safeDateConvert(apiTour.category.updatedAt) ?? updatedAtIso,
    } : undefined,
    images: images,
    dates: tourDates,
    is_active: apiTour.status === 'ACTIVE',
    created_at: createdAtIso,
    updated_at: updatedAtIso,
    rating: 4.5, // Default rating
    reviews_count: apiTour._count?.orders || 0,
    image: images[0]?.image_url || '',
    badge: apiTour.tags?.[0] || undefined,
    type: apiTour.type || 'standard',
    guide: apiTour.guide ? {
      name: apiTour.guide.name || 'Guide',
      avatar: apiTour.guide.avatar || ''
    } : undefined,
    inclusions: parseMultilingualArray(apiTour.inclusions),
    exclusions: parseMultilingualArray(apiTour.exclusions),
    itinerary: itinerary,
    currency: apiTour.currency || 'UZS',
    startDate: startDateIso ?? apiTour.startDate,
    endDate: endDateIso ?? apiTour.endDate,
    // For backward compatibility
    reviewCount: apiTour._count?.orders || 0,
    participants: apiTour.orders?.reduce((sum, order) => sum + (order.participants || 0), 0) || 0,
    maxParticipants: apiTour.maxParticipants || 0,
    program: programDays,
    programDays: programDays,
  };
};

export const useTours = (params: UseToursParams = {}): UseToursReturn => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseToursReturn['pagination']>(null);

  const { autoFetch = true, accumulate = false, ...apiParams } = params;

  const { language } = useLanguage();

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestParams: Record<string, string | number> = {
        page: apiParams.page || 1,
        limit: apiParams.limit || apiParams.per_page || 50,
      };

      if (apiParams.search) requestParams.search = apiParams.search;
      if (apiParams.destination) requestParams.destination = apiParams.destination;
      if (apiParams.minPrice || apiParams.min_price) requestParams.minPrice = apiParams.minPrice || apiParams.min_price;
      if (apiParams.maxPrice || apiParams.max_price) requestParams.maxPrice = apiParams.maxPrice || apiParams.max_price;
      if (apiParams.status) requestParams.status = apiParams.status;
      if (apiParams.categoryId) requestParams.categoryId = apiParams.categoryId;
      if (apiParams.category_id) requestParams.categoryId = apiParams.category_id.toString();
      if (apiParams.startDate) requestParams.startDate = apiParams.startDate;
      if (apiParams.endDate) requestParams.endDate = apiParams.endDate;

      requestParams.lang = language;

      const response = await djidaliApi.getTours(requestParams);

      const convertedTours = response.data.map((tour) => convertApiTourToTour(tour, language));

      setTours((prev) => {
        if (accumulate && requestParams.page > 1 && prev.length > 0) {
          const existingIds = new Set(prev.map((tour) => tour.id));
          const merged = [...prev];

          convertedTours.forEach((tour) => {
            if (!existingIds.has(tour.id)) {
              merged.push(tour);
            }
          });

          return merged;
        }

        return convertedTours;
      });

      setPagination({
        current_page: response.page || 1,
        last_page: response.totalPages || 1,
        per_page: requestParams.limit,
        total: response.total || response.data.length,
        from: ((response.page || 1) - 1) * requestParams.limit + 1,
        to: Math.min((response.page || 1) * requestParams.limit, response.total || response.data.length),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tours';
      setError(errorMessage);
      console.error('Error fetching tours:', err);
      setTours([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTours();
    }
  }, [
    params.page,
    params.limit,
    params.per_page,
    params.category_id,
    params.categoryId,
    params.search,
    params.min_price,
    params.max_price,
    params.minPrice,
    params.maxPrice,
    params.duration,
    params.destination,
    params.status,
    params.startDate,
    params.endDate,
    autoFetch,
    accumulate,
    language
  ]);

  return {
    tours,
    loading,
    error,
    pagination,
    fetchTours,
    refetch: fetchTours,
  };
};

export const useTour = (id: string | null) => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchTour = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await djidaliApi.getTour(id, { lang: language });
      const convertedTour = convertApiTourToTour(response, language);
      setTour(convertedTour);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tour';
      setError(errorMessage);
      console.error('Error fetching tour:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTour();
  }, [id, language]);

  return {
    tour,
    loading,
    error,
    refetch: fetchTour,
  };
};
