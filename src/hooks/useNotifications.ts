import { useState, useEffect } from 'react';
import { apiService, Notification, PaginatedResponse } from '../services/api';

interface UseNotificationsParams {
  is_read?: boolean;
  type?: string;
  page?: number;
  per_page?: number;
  autoFetch?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
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
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  refetch: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotifications = (params: UseNotificationsParams = {}): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseNotificationsReturn['pagination']>(null);

  const { autoFetch = true, ...apiParams } = params;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<Notification> = await apiService.getNotifications(apiParams);
      
      setNotifications(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiService.markNotificationAsRead(id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(errorMessage);
      throw err;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      setError(null);
      await apiService.markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      setError(errorMessage);
      throw err;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [
    params.is_read,
    params.type,
    params.page,
    params.per_page,
    autoFetch
  ]);

  return {
    notifications,
    loading,
    error,
    pagination,
    unreadCount,
    fetchNotifications,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};