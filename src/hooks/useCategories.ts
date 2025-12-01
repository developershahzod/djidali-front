import { useState, useEffect } from 'react';
import { djidaliApi, ApiCategory } from '../services/djidaliApi';
import { useLanguage } from '../contexts/LanguageContext';

interface UseCategoriesReturn {
  categories: ApiCategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  refetch: () => Promise<void>;
}

// Helper function to get translated field value from separate language fields
const getTranslatedField = (category: any, fieldPrefix: string, lang: string): string => {
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
  const value = category[translatedField];
  
  // If not found, fallback to base field, then other languages
  if (value) return value;
  if (category[fieldPrefix]) return category[fieldPrefix];
  if (category[`${fieldPrefix}Eng`]) return category[`${fieldPrefix}Eng`];
  if (category[`${fieldPrefix}Uz`]) return category[`${fieldPrefix}Uz`];
  if (category[`${fieldPrefix}Ru`]) return category[`${fieldPrefix}Ru`];
  if (category[`${fieldPrefix}De`]) return category[`${fieldPrefix}De`];
  
  return '';
};

// Helper function to process category translations
const processCategoryTranslations = (category: ApiCategory, lang: string): ApiCategory => {
  return {
    ...category,
    name: getTranslatedField(category, 'name', lang),
    description: getTranslatedField(category, 'description', lang),
    children: category.children?.map(child => processCategoryTranslations(child, lang)),
  };
};

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategories({ lang: language });
      // Process translations for each category
      const processedCategories = data.map(cat => processCategoryTranslations(cat, language));
      setCategories(processedCategories);
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
  }, [language]);

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
  const { language } = useLanguage();

  const fetchCategory = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategory(id, { lang: language });
      // Process translations
      const processedCategory = processCategoryTranslations(data, language);
      setCategory(processedCategory);
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
  }, [id, language]);

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
  const { language } = useLanguage();

  const fetchCategory = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategoryBySlug(slug, { lang: language });
      // Process translations
      const processedCategory = processCategoryTranslations(data, language);
      setCategory(processedCategory);
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
  }, [slug, language]);

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
  const { language } = useLanguage();

  const fetchCategoryTree = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await djidaliApi.getCategoryTree({ lang: language });
      // Process translations for tree structure
      const processedCategories = data.map(cat => processCategoryTranslations(cat, language));
      setCategories(processedCategories);
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
  }, [language]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategoryTree,
  };
};
