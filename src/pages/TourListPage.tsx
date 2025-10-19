import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TourListHero from '../components/TourListHero';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTourPrimaryImage } from '../utils/imageUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useTours } from '../hooks/useTours';

export interface TourFilters {
  country: string;
  tourType: string;
  date: string;
  participants: string;
}

const TourListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TourFilters>({
    country: 'tashkent',
    tourType: 'eco',
    date: 'sep-12-20',
    participants: 'family'
  });
  const [activeFilters, setActiveFilters] = useState<TourFilters | null>(null);

  // Маппинг значений фильтров для API
  const getApiParams = () => {
    if (!activeFilters) return {};

    const params: any = {};

    // Маппинг стран на destinations
    const countryMap: Record<string, string> = {
      'tashkent': 'Ташкент',
      'samarkand': 'Самарканд',
      'bukhara': 'Бухара',
      'khiva': 'Хива'
    };

    if (activeFilters.country) {
      params.destination = countryMap[activeFilters.country] || activeFilters.country;
    }

    // Можно добавить маппинг для типа тура, если API поддерживает
    // if (activeFilters.tourType) {
    //   params.search = activeFilters.tourType;
    // }

    return params;
  };

  const { tours, loading, error, pagination } = useTours({
    page: currentPage,
    limit: 10,
    accumulate: currentPage > 1,
    ...getApiParams()
  });

  const handleSearch = () => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<TourFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const hasMoreTours = pagination ? currentPage < pagination.last_page : false;

  return (
    <div className="bg-[#F5F1E6] text-[#2A241C]">
      <TourListHero
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <main className="bg-[#F4F2ED] py-24">
        <div className="max-w-[1440px] mx-auto px-[50px]">
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" color="emerald" />
            </div>
          )}

          {error && !loading && (
            <div className="bg-[#FCE8E6] border border-[#F5B1A8] text-[#8C342A] rounded-[20px] px-8 py-6 text-center">
              {t('common.error')} • {error}
            </div>
          )}

          <div className="flex flex-col gap-[20px]">
            {!loading && !error && tours.map((tour) => (
              <article
                key={tour.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/tour/${tour.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/tour/${tour.id}`);
                  }
                }}
                className="group relative h-[295px] rounded-[20px] border-2 border-[silver] cursor-pointer transition-colors hover:bg-white hover:border-[#A5956D] focus:outline-none"
              >
                {/* Левая часть - контент */}
                <div className="absolute left-[40px] top-[40px] flex flex-col gap-[20px] w-[557px] text-[#333333]">
                  <h3 className="font-medium leading-[40px] text-[32px] tracking-[-0.64px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {tour.title}
                  </h3>
                  <p className="font-normal leading-[24px] text-[20px] tracking-[-0.4px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {tour.location || t('tour.defaultLocation')}
                  </p>
                </div>

                {/* Цена */}
                <div className="absolute left-[40px] top-[191px] flex flex-col gap-[10px] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <p className="font-medium leading-[38px] text-[28px] tracking-[-0.56px]">
                    {Number((typeof tour.price === 'object' ? tour.price?.amount : tour.price) || 0).toLocaleString('ru-RU')} UZS
                  </p>
                  <p className="font-medium leading-[16px] text-[16px] tracking-[-0.32px]">
                    {t('tour.from')}
                  </p>
                </div>

                {/* Вертикальный разделитель */}
                <div className="absolute left-[278px] top-[193px] w-0 h-[63px] border-l border-[#333333] opacity-20"></div>

                {/* Информация о туре */}
                <div className="absolute left-[328px] top-[191px]">
                  <div className="flex flex-col gap-[10px] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <p className="font-medium leading-[38px] text-[28px] tracking-[-0.56px] whitespace-nowrap">
                      {tour.duration || 0} {t('tour.days')}, {t('tour.upTo')} {(tour.max_participants ?? (tour as any).maxParticipants ?? 15)} {t('tour.people')}
                    </p>
                    <p className="font-medium leading-[16px] text-[16px] tracking-[-0.32px]">
                      {t('home.popular.planIncludes')}
                    </p>
                  </div>
                </div>

                {/* Правая часть - изображение */}
                <div className="absolute right-[20px] top-[20px] w-[450px] h-[255px] rounded-[20px] overflow-hidden">
                  <img
                    src={getTourPrimaryImage(tour)}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>

                  {/* Бейдж категории */}
                  {(tour.category?.name || (tour as any).badge || (tour as any).type) && (
                    <div className="absolute bottom-[32px] right-[32px] bg-white rounded-[16px] px-[6px] py-[2px] z-10">
                      <p className="font-medium leading-[16px] text-[16px] tracking-[-0.32px] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {tour.category?.name || (tour as any).badge || (tour as any).type || 'Экотуризм'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Кнопка-стрелка */}
                <div className="absolute left-[833px] top-[107px] w-[80px] h-[80px] rounded-full bg-white flex items-center justify-center group-hover:bg-[#8F7B49] transition-colors">
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#333333] group-hover:text-white transition-colors">
                    <path d="M6.33334 19H31.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.1667 9.5L31.6667 19L22.1667 28.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </article>
            ))}
          </div>

          {!loading && !error && tours.length === 0 && (
            <div className="rounded-[20px] bg-white/80 border-2 border-[silver] px-8 py-10 text-center text-[#333333]">
              {t('home.popular.emptyState')}
            </div>
          )}

          {!loading && !error && tours.length > 0 && hasMoreTours && (
            <div className="mt-[80px] flex justify-center">
              <button
                className="w-full border-2 border-[silver] rounded-[20px] px-[40px] py-[26px] flex items-center justify-center font-normal leading-[24px] text-[20px] tracking-[-0.4px] text-[#333333] hover:bg-white/70 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                onClick={handleLoadMore}
              >
                {t('common.showMore')}
              </button>
            </div>
          )}

          {loading && currentPage > 1 && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="emerald" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};




export default TourListPage;
