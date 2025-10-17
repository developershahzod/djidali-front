import { useState, useEffect } from 'react';
import { djidaliApi, ApiWishlistItem } from '../services/djidaliApi';

interface UseWishlistReturn {
  wishlist: ApiWishlistItem[];
  loading: boolean;
  error: string | null;
  addToWishlist: (tourId: string) => Promise<void>;
  removeFromWishlist: (tourId: string) => Promise<void>;
  isInWishlist: (tourId: string) => boolean;
  refetch: () => Promise<void>;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlist, setWishlist] = useState<ApiWishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await djidaliApi.getWishlist();
      setWishlist(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wishlist';
      setError(errorMessage);
      console.error('Error fetching wishlist:', err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (tourId: string): Promise<void> => {
    try {
      await djidaliApi.addToWishlist(tourId);
      await fetchWishlist();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to wishlist';
      throw new Error(errorMessage);
    }
  };

  const removeFromWishlist = async (tourId: string): Promise<void> => {
    try {
      await djidaliApi.removeFromWishlist(tourId);
      await fetchWishlist();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from wishlist';
      throw new Error(errorMessage);
    }
  };

  const isInWishlist = (tourId: string): boolean => {
    return wishlist.some(item => item.tourId === tourId);
  };

  useEffect(() => {
    if (djidaliApi.isAuthenticated()) {
      fetchWishlist();
    }
  }, []);

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlist,
  };
};
