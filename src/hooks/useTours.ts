import { useState, useEffect } from 'react';
import { djidaliApi, ApiTour } from '../services/djidaliApi';
import { Tour } from '../services/api';

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

const convertApiTourToTour = (apiTour: ApiTour): Tour => {
  const priceSource = apiTour.price;
  let priceValue = 0;

  if (typeof priceSource === 'number') {
    priceValue = priceSource;
  } else if (priceSource && typeof priceSource === 'object') {
    const candidates = [
      priceSource.amount,
      priceSource.uzs,
      priceSource.UZS,
      priceSource.usd,
      priceSource.value
    ];

    const resolved = candidates.find((candidate) => candidate !== undefined && candidate !== null);
    if (resolved !== undefined) {
      priceValue = Number(resolved);
    }
  }

  return {
    id: apiTour.id,
    title: apiTour.title,
    description: apiTour.description,
    price: priceValue,
    duration: apiTour.duration,
    max_participants: apiTour.maxParticipants,
    current_participants: apiTour.orders?.reduce((sum, order) => sum + order.participants, 0) || 0,
    location: apiTour.destination,
    category_id: 1,
    is_active: apiTour.status === 'ACTIVE',
    created_at: apiTour.createdAt,
    updated_at: apiTour.updatedAt,
    rating: 4.5,
    reviewCount: apiTour._count?.orders || 0,
    reviews_count: apiTour._count?.orders || 0,
    image: apiTour.images[0] || '',
    type: apiTour.type,
    images: apiTour.images.map((url, idx) => ({
      id: idx,
      tour_id: apiTour.id,
      image_url: url,
      is_primary: idx === 0,
      order: idx,
      created_at: apiTour.createdAt,
      updated_at: apiTour.updatedAt,
    })),
    participants: apiTour.orders?.reduce((sum, order) => sum + order.participants, 0) || 0,
    maxParticipants: apiTour.maxParticipants,
    included: apiTour.inclusions,
    excluded: apiTour.exclusions,
    itinerary: Object.entries(apiTour.itinerary || {}).map(([key, value], idx) => ({
      id: idx,
      tour_id: apiTour.id,
      day: parseInt(key.replace(/\D/g, '')) || idx + 1,
      title: key,
      description: value,
    })),
    currency: 'UZS',
    dates: [],
    category: {
      id: 1,
      name: 'Tour',
      slug: 'tour',
    },
  };
};

export const useTours = (params: UseToursParams = {}): UseToursReturn => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseToursReturn['pagination']>(null);

  const { autoFetch = true, accumulate = false, ...apiParams } = params;

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestParams: any = {
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

      const response = await djidaliApi.getTours(requestParams);

      const convertedTours = response.data.map(convertApiTourToTour);

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
    autoFetch,
    accumulate
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

  const fetchTour = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await djidaliApi.getTour(id);
      const convertedTour = convertApiTourToTour(response);
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
  }, [id]);

  return {
    tour,
    loading,
    error,
    refetch: fetchTour,
  };
};
