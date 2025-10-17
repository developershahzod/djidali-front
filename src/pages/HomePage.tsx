import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
import WelcomeLoader from '../components/WelcomeLoader';
import PageSkeleton from '../components/PageSkeleton';
import HeroSection from '../components/HeroSection';
import TourGrid from '../components/TourGrid';
import { FilterState } from '../types';
import { useTours } from '../hooks/useTours';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get('categoryId');

  const [showLoader, setShowLoader] = useState(true);
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    categoryId,
    minPrice: debouncedFilters.priceRange[0],
    maxPrice: debouncedFilters.priceRange[1],
    duration: debouncedFilters.duration[0],
    limit: 5,
    page,
    accumulate: true,
  }), [categoryId, debouncedFilters.priceRange, debouncedFilters.duration, page]);

  const { tours, loading, error, pagination } = useTours(tourParams);

  useEffect(() => {
    if (pagination) {
      setHasMore(pagination.current_page < pagination.last_page);
    }
  }, [pagination]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters, categoryId]);

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/tours?search=${encodeURIComponent(trimmedQuery)}` : '/tours');
  }, [navigate]);

  const handleShowMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  if (showLoader) {
    return <WelcomeLoader onComplete={() => setShowLoader(false)} />;
  }

  if (loading && page === 1) {
    return <PageSkeleton showSidebar={true} showGrid={true} gridCols={3} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection onSearch={handleSearch} />

      <div className="max-w-[1450px] mx-auto px-0 ">
        <section className="mb-0">
          <div className="grid lg:grid-cols-2 gap-0 mb-0">
            <div className="pr-16 py-12" style={{zIndex: 100, paddingLeft: 20,
            }}>
              <h2 className="text-[3.0rem] font-light text-gray-900 mb-3 leading-tight" style={{fontWeight: '500'}}>О нас</h2>
              <p className="text-gray-600 text-[1.6rem] leading-relaxed mb-12 font-light" style={{fontWeight: '500'}}>
                Мы помогаем вам найти <span className="text-[#8B7355]">путешествие вашей мечты</span> и открыть красоту природы в её лучших проявлениях.
              </p>

              <div className="gap-6" style={{marginTop: 0,
              }}>
                <div className="flex-shrink-0">
                  <img src="/sam.jpg" alt="Icon" className="w-20 h-20 object-contain" />
                </div>
                <div>
                  <p className="text-gray-600 text-[1rem] leading-relaxed font-light">
                    Здесь вас ждут маршруты, пейзажи и впечатления, которые останутся в памяти навсегда
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[700px] overflow-hidden">
              <img
                src="/photo_5445168424612398617_w.jpg"
                alt="Nature"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <div className="mb-32 bg-[#F4F2ED] pt-20 px-10 pb-10">
          <div className="flex items-start justify-between mb-16">
            <h2 className="text-[2.5rem] font-light text-gray-900 tracking-tight">Популярные туры</h2>
            <span className="text-base text-gray-500 font-light mt-2"><span className="font-normal text-gray-900">14 доступных</span> направлений</span>
          </div>

          <TourGrid
            tours={tours as any}
            loading={loading && page === 1 && tours.length === 0}
            error={error}
            onShowMore={handleShowMore}
            showMoreVisible={hasMore}
          />
        </div>

        <section className="mb-32">
          <h2 className="text-[2.5rem] font-light text-gray-900 tracking-tight mb-16" style={{paddingLeft: 50,
          }}>Почему мы</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[380px]  overflow-hidden">
              <img
                src="/photo_5445168424612398617_w.jpg"
                alt="Pristine nature"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-[1.5rem] font-light leading-tight">Знакомство с<br />первозданной природой</h3>
              </div>
            </div>

            <div className="relative h-[380px]  overflow-hidden">
              <img
                src="/photo_5445168424612397991_w.jpg"
                alt="Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-[1.5rem] font-light leading-tight">Команда<br />специалистов</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-[380px]  overflow-hidden">
              <img
                src="https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg"
                alt="Comfortable accommodation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-[1.5rem] font-light leading-tight">Комфортное<br />проживание</h3>
              </div>
            </div>

            <div className="relative h-[380px]  overflow-hidden">
              <img
                src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg"
                alt="Unique routes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-white text-[1.5rem] font-light leading-tight">Уникальные<br />маршруты</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;