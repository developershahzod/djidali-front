import { useState, useEffect } from 'react';
import { apiService, Booking, PaginatedResponse, CustomerInfo } from '../services/api';

interface UseBookingsParams {
  page?: number;
  per_page?: number;
  status?: string;
  tour_id?: number;
  user_id?: number;
  autoFetch?: boolean;
}

interface UseBookingsReturn {
  bookings: Booking[];
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
  fetchBookings: () => Promise<void>;
  refetch: () => Promise<void>;
  createBooking: (bookingData: {
    tour_id: number;
    tour_date_id: number;
    participants_count: number;
    customer_info: CustomerInfo;
  }) => Promise<Booking>;
  cancelBooking: (id: number) => Promise<void>;
  confirmBooking: (id: number) => Promise<void>;
}

export const useBookings = (params: UseBookingsParams = {}): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseBookingsReturn['pagination']>(null);

  const { autoFetch = true, ...apiParams } = params;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<Booking> = await apiService.getBookings(apiParams);
      
      setBookings(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(errorMessage);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    tour_id: number;
    tour_date_id: number;
    participants_count: number;
    customer_info: CustomerInfo;
  }): Promise<Booking> => {
    try {
      setError(null);
      const booking = await apiService.createBooking(bookingData);
      
      // Refresh bookings list
      await fetchBookings();
      
      return booking;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw err;
    }
  };

  const cancelBooking = async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiService.cancelBooking(id);
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(errorMessage);
      throw err;
    }
  };

  const confirmBooking = async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiService.confirmBooking(id);
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id 
            ? { ...booking, status: 'confirmed' as const }
            : booking
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm booking';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [
    params.page,
    params.per_page,
    params.status,
    params.tour_id,
    params.user_id,
    autoFetch
  ]);

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    refetch: fetchBookings,
    createBooking,
    cancelBooking,
    confirmBooking,
  };
};

// Hook for single booking
export const useBooking = (id: number | null) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getBooking(id);
      setBooking(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking';
      setError(errorMessage);
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  return {
    booking,
    loading,
    error,
    refetch: fetchBooking,
  };
};