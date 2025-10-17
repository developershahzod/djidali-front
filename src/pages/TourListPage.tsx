import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import TourGrid from '../components/TourGrid';
import FilterSidebar from '../components/FilterSidebar';
import { FilterState } from '../types';
import { useTours } from '../hooks/useTours';

const defaultFilters: FilterState = {
  category: 'all',
  subcategory: 'all',
  priceRange: [0, 1000000],
  duration: [1, 30],
  rating: 0,
  language: ['russian'],
  discountOnly: false,
  guaranteedOnly: false,
};

const TourListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setSearchQuery(initialSearch);
    setPage(1);
  }, [initialSearch]);

  const categoryId = filters.category !== 'all' ? filters.category : undefined;

  const tourParams = useMemo(() => ({
    search: searchQuery || undefined,
    categoryId,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    duration: filters.duration[0],
    limit: 9,
    page,
    accumulate: true,
  }), [searchQuery, categoryId, filters.priceRange, filters.duration, page]);

  const { tours, loading, error, pagination } = useTours(tourParams);

  useEffect(() => {
    if (pagination) {
      setHasMore(pagination.current_page < pagination.last_page);
    }
  }, [pagination]);

  const handleFiltersChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...updated,
    }));
    setPage(1);
  };

  const handleShowMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleHeroSearch = (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);
    setPage(1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (trimmed) {
        next.set('search', trimmed);
      } else {
        next.delete('search');
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F4F2ED]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <HeroSection onSearch={handleHeroSearch} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-10">
          <div>
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          <div>
            <TourGrid
              tours={tours as any}
              loading={loading && page === 1 && tours.length === 0}
              error={error}
              onShowMore={handleShowMore}
              showMoreVisible={hasMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListPage;
