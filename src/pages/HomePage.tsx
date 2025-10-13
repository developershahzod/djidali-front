import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
import WelcomeLoader from '../components/WelcomeLoader';
import PageSkeleton from '../components/PageSkeleton';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import TourGrid from '../components/TourGrid';
import FilterSidebar from '../components/FilterSidebar';
import { FilterState } from '../types';
import { useTours } from '../hooks/useTours';
import { djidaliApi } from '../services/djidaliApi';
import { Tour } from '../services/api';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get('categoryId');

  const [showLoader, setShowLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: categoryIdFromUrl || 'all',
    subcategory: 'all',
    priceRange: [0, 1000000],
    duration: [1, 30],
    rating: 0,
    language: ['russian'],
    discountOnly: false,
    guaranteedOnly: false
  });
  const [debouncedFilters, setDebouncedFilters] = useState<FilterState>(filters);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSetFilters = useMemo(
    () => debounce((newFilters: FilterState) => {
      setDebouncedFilters(newFilters);
    }, 300),
    []
  );

  useEffect(() => {
    if (categoryIdFromUrl) {
      setFilters(prev => ({ ...prev, category: categoryIdFromUrl }));
    }
  }, [categoryIdFromUrl]);

  useEffect(() => {
    debouncedSetFilters(filters);
  }, [filters, debouncedSetFilters]);

  const categoryId = debouncedFilters.category !== 'all' ? debouncedFilters.category : undefined;

  const tourParams = useMemo(() => ({
    search: searchQuery && !isSearching ? searchQuery : undefined,
    categoryId: categoryId,
    minPrice: debouncedFilters.priceRange[0],
    maxPrice: debouncedFilters.priceRange[1],
    duration: debouncedFilters.duration[0],
    limit: 50,
  }), [searchQuery, isSearching, categoryId, debouncedFilters.priceRange, debouncedFilters.duration]);

  const { tours, loading, error } = useTours(tourParams);

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchQuery('');
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchLoading(true);
    setSearchQuery(query);

    try {
      const response = await djidaliApi.getTours({
        search: query,
        limit: 50,
      });
      setSearchResults(response.data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  if (showLoader) {
    return <WelcomeLoader onComplete={() => setShowLoader(false)} />;
  }

  const displayTours = isSearching ? searchResults : tours;
  const displayLoading = isSearching ? searchLoading : loading;

  if (loading && !isSearching) {
    return <PageSkeleton showSidebar={true} showGrid={true} gridCols={3} />;
  }

 return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <HeroSection onSearch={handleSearch} />
    <FeatureCards />

    {/* Responsive wrapper */}
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar (on top in mobile, left on desktop) */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Tour grid */}
        <div className="flex-1 min-w-0">
          <TourGrid
            tours={displayTours as any}
            loading={displayLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  </div>
);
};

export default HomePage;