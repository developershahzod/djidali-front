import { useState, useEffect } from 'react';
import { apiService, Review, PaginatedResponse } from '../services/api';

interface UseReviewsParams {
  tour_id?: number;
  user_id?: number;
  rating?: number;
  is_approved?: boolean;
  page?: number;
  per_page?: number;
  autoFetch?: boolean;
}

interface UseReviewsReturn {
  reviews: Review[];
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
  fetchReviews: () => Promise<void>;
  refetch: () => Promise<void>;
  createReview: (reviewData: {
    tour_id: number;
    booking_id?: number;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }) => Promise<Review>;
  updateReview: (id: number, reviewData: Partial<Review>) => Promise<Review>;
  deleteReview: (id: number) => Promise<void>;
  approveReview: (id: number) => Promise<Review>;
  markHelpful: (id: number) => Promise<Review>;
}

export const useReviews = (params: UseReviewsParams = {}): UseReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseReviewsReturn['pagination']>(null);

  const { autoFetch = true, ...apiParams } = params;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      setReviews([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(errorMessage);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: {
    tour_id: number;
    booking_id?: number;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }): Promise<Review> => {
    try {
      setError(null);
      const review = await apiService.createReview(reviewData);
      
      // Refresh reviews list
      await fetchReviews();
      
      return review;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create review';
      setError(errorMessage);
      throw err;
    }
  };

  const updateReview = async (id: number, reviewData: Partial<Review>): Promise<Review> => {
    try {
      setError(null);
      const review = await apiService.updateReview(id, reviewData);
      
      // Update local state
      setReviews(prev => 
        prev.map(r => r.id === id ? { ...r, ...reviewData } : r)
      );
      
      return review;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update review';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteReview = async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiService.deleteReview(id);
      
      // Remove from local state
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete review';
      setError(errorMessage);
      throw err;
    }
  };

  const approveReview = async (id: number): Promise<Review> => {
    try {
      setError(null);
      const review = await apiService.approveReview(id);
      
      // Update local state
      setReviews(prev => 
        prev.map(r => r.id === id ? { ...r, is_approved: true } : r)
      );
      
      return review;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve review';
      setError(errorMessage);
      throw err;
    }
  };

  const markHelpful = async (id: number): Promise<Review> => {
    try {
      setError(null);
      const review = await apiService.markReviewHelpful(id);
      
      // Update local state
      setReviews(prev => 
        prev.map(r => r.id === id ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r)
      );
      
      return review;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark review as helpful';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchReviews();
    }
  }, [
    params.tour_id,
    params.user_id,
    params.rating,
    params.is_approved,
    params.page,
    params.per_page,
    autoFetch
  ]);

  return {
    reviews,
    loading,
    error,
    pagination,
    fetchReviews,
    refetch: fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    markHelpful,
  };
};

// Hook for single review
export const useReview = (id: number | null) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReview = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getReview(id);
      setReview(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch review';
      setError(errorMessage);
      console.error('Error fetching review:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  return {
    review,
    loading,
    error,
    refetch: fetchReview,
  };
};