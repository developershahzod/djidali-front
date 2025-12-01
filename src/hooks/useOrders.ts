import { useState, useEffect } from 'react';
import { djidaliApi, ApiOrder } from '../services/djidaliApi';

interface UseOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  tourId?: string;
  autoFetch?: boolean;
}

interface UseOrdersReturn {
  orders: ApiOrder[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  createOrder: (data: { tourId: string; participants: number }) => Promise<ApiOrder>;
  updateOrder: (id: string, data: Partial<ApiOrder>) => Promise<ApiOrder>;
  cancelOrder: (id: string) => Promise<ApiOrder>;
  refetch: () => Promise<void>;
}

export const useOrders = (params: UseOrdersParams = {}): UseOrdersReturn => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseOrdersReturn['pagination']>(null);

  const { autoFetch = true, ...apiParams } = params;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await djidaliApi.getOrders(apiParams);
      setOrders(response.data);

      setPagination({
        current_page: response.page || 1,
        last_page: response.totalPages || 1,
        per_page: apiParams.limit || 20,
        total: response.total || response.data.length,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (data: { tourId: string; participants: number }): Promise<ApiOrder> => {
    try {
      const order = await djidaliApi.createOrder(data);
      await fetchOrders();
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      throw new Error(errorMessage);
    }
  };

  const updateOrder = async (id: string, data: Partial<ApiOrder>): Promise<ApiOrder> => {
    try {
      const order = await djidaliApi.updateOrder(id, data);
      await fetchOrders();
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      throw new Error(errorMessage);
    }
  };

  const cancelOrder = async (id: string): Promise<ApiOrder> => {
    try {
      const order = await djidaliApi.cancelOrder(id);
      await fetchOrders();
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel order';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [
    params.page,
    params.limit,
    params.status,
    params.tourId,
    autoFetch
  ]);

  return {
    orders,
    loading,
    error,
    pagination,
    createOrder,
    updateOrder,
    cancelOrder,
    refetch: fetchOrders,
  };
};

export const useOrder = (id: string | null) => {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await djidaliApi.getOrder(id);
      setOrder(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
};
