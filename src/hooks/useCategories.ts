import { useState, useEffect } from 'react';
import { djidaliApi, ApiCategory } from '../services/djidaliApi';

interface UseCategoriesReturn {
  categories: ApiCategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    refetch: fetchCategories,
  };
};

export const useCategory = (id: string | null) => {
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategory(id);
      setCategory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(errorMessage);
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
};

export const useCategoryBySlug = (slug: string | null) => {
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategoryBySlug(slug);
      setCategory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category';
      setError(errorMessage);
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory,
  };
};

export const useCategoryTree = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryTree = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategoryTree();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category tree';
      setError(errorMessage);
      console.error('Error fetching category tree:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryTree();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategoryTree,
  };
};
