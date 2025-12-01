import { useState, useEffect } from 'react';
import { apiService, Payment, PaginatedResponse } from '../services/api';

interface UsePaymentsParams {
  booking_id?: number;
  status?: string;
  page?: number;
  per_page?: number;
  autoFetch?: boolean;
}

interface UsePaymentsReturn {
  payments: Payment[];
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
  fetchPayments: () => Promise<void>;
  refetch: () => Promise<void>;
  createPayment: (paymentData: {
    booking_id: number;
    amount: number;
    payment_method: string;
  }) => Promise<Payment>;
  processPayment: (id: number, paymentData: {
    transaction_id?: string;
    payment_details?: any;
  }) => Promise<Payment>;
}

export const usePayments = (params: UsePaymentsParams = {}): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UsePaymentsReturn['pagination']>(null);

  const { autoFetch = true, ...apiParams } = params;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<Payment> = await apiService.getPayments(apiParams);
      
      setPayments(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(errorMessage);
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: {
    booking_id: number;
    amount: number;
    payment_method: string;
  }): Promise<Payment> => {
    try {
      setError(null);
      const payment = await apiService.createPayment(paymentData);
      
      // Refresh payments list
      await fetchPayments();
      
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      throw err;
    }
  };

  const processPayment = async (id: number, paymentData: {
    transaction_id?: string;
    payment_details?: any;
  }): Promise<Payment> => {
    try {
      setError(null);
      const payment = await apiService.processPayment(id, paymentData);
      
      // Update local state
      setPayments(prev => 
        prev.map(p => p.id === id ? { ...p, ...payment } : p)
      );
      
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPayments();
    }
  }, [
    params.booking_id,
    params.status,
    params.page,
    params.per_page,
    autoFetch
  ]);

  return {
    payments,
    loading,
    error,
    pagination,
    fetchPayments,
    refetch: fetchPayments,
    createPayment,
    processPayment,
  };
};