import { useState } from "react";
import {
  apiService,
  Statistics,
  User,
  PaginatedResponse,
} from "../services/api";

interface UseAdminReturn {
  statistics: Statistics | null;
  users: User[];
  loading: boolean;
  error: string | null;
  usersPagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  } | null;
  fetchStatistics: () => Promise<void>;
  fetchUsers: (params?: {
    page?: number;
    per_page?: number;
    role?: string;
    search?: string;
    is_active?: boolean;
  }) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  activateUser: (id: number) => Promise<User>;
  deactivateUser: (id: number) => Promise<User>;
}

export const useAdmin = (): UseAdminReturn => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersPagination, setUsersPagination] =
    useState<UseAdminReturn["usersPagination"]>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const stats = await apiService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch statistics";
      setError(errorMessage);
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (params?: {
    page?: number;
    per_page?: number;
    role?: string;
    search?: string;
    is_active?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedResponse<User> =
        await apiService.getUsers(params);

      setUsers(response.data);
      setUsersPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
        from: response.from,
        to: response.to,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    id: number,
    userData: Partial<User>,
  ): Promise<User> => {
    try {
      setError(null);
      const user = await apiService.updateUser(id, userData);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...userData } : u)),
      );

      return user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiService.deleteUser(id);

      // Remove from local state
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      throw err;
    }
  };

  const activateUser = async (id: number): Promise<User> => {
    try {
      setError(null);
      const user = await apiService.activateUser(id);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: true } : u)),
      );

      return user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to activate user";
      setError(errorMessage);
      throw err;
    }
  };

  const deactivateUser = async (id: number): Promise<User> => {
    try {
      setError(null);
      const user = await apiService.deactivateUser(id);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: false } : u)),
      );

      return user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deactivate user";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    statistics,
    users,
    loading,
    error,
    usersPagination,
    fetchStatistics,
    fetchUsers,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
  };
};
