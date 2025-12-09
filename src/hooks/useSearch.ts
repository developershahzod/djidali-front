import { useState, useCallback } from "react";
import { apiService, Tour } from "../services/api";
import { debounce } from "lodash";

interface UseSearchReturn {
  results: Tour[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  searchTours: (
    query: string,
    filters?: {
      category_id?: number;
      min_price?: number;
      max_price?: number;
      duration?: number;
      location?: string;
    },
  ) => Promise<void>;
  getSuggestions: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<Tour[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTours = async (
    query: string,
    filters?: {
      category_id?: number;
      min_price?: number;
      max_price?: number;
      duration?: number;
      location?: string;
    },
  ) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tours = await apiService.searchTours(query, filters);
      setResults(tours);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestions = await apiService.getSearchSuggestions(query);
      setSuggestions(suggestions);
    } catch (err) {
      console.error("Suggestions error:", err);
      setSuggestions([]);
    }
  };

  // Debounced version of getSuggestions
  const debouncedGetSuggestions = useCallback(
    debounce((query: string) => getSuggestions(query), 300),
    [],
  );

  const clearResults = () => {
    setResults([]);
    setSuggestions([]);
    setError(null);
  };

  return {
    results,
    suggestions,
    loading,
    error,
    searchTours,
    getSuggestions: debouncedGetSuggestions,
    clearResults,
  };
};
