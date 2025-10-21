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

      <main className="bg-[#F4F2ED] py-[clamp(40px,6.67vw,96px)]">
        <div className="max-w-[min(1440px,100vw)] mx-auto px-[clamp(20px,3.47vw,50px)]">
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
                className="group relative rounded-[20px] border-2 border-[silver] cursor-pointer transition-colors hover:bg-white hover:border-[#A5956D] focus:outline-none overflow-hidden"
              >
                {/* Desktop & Tablet Layout */}
                <div className="hidden lg:block relative h-[clamp(240px,20.49vw,295px)]">
                  {/* Левая часть - контент */}
                  <div className="absolute left-[clamp(20px,2.78vw,40px)] top-[clamp(20px,2.78vw,40px)] flex flex-col gap-[clamp(12px,1.39vw,20px)] w-[clamp(320px,38.68vw,557px)] text-[#333333]">
                    <h3 className="font-medium leading-[1.25] text-[clamp(20px,2.22vw,32px)] tracking-[-0.02em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {tour.title}
                    </h3>
                    <p className="font-normal leading-[1.2] text-[clamp(14px,1.39vw,20px)] tracking-[-0.02em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {tour.location || t('tour.defaultLocation')}
                    </p>
                  </div>

                  {/* Цена */}
                  <div className="absolute left-[clamp(20px,2.78vw,40px)] bottom-[clamp(20px,2.78vw,40px)] flex flex-col gap-[clamp(6px,0.69vw,10px)] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <p className="font-medium leading-[1.35] text-[clamp(18px,1.94vw,28px)] tracking-[-0.02em]">
                      {Number((typeof tour.price === 'object' ? (tour.price as any)?.amount : tour.price) || 0).toLocaleString('ru-RU')} UZS
                    </p>
                    <p className="font-medium leading-[1] text-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                      {t('tour.from')}
                    </p>
                  </div>

                  {/* Вертикальный разделитель */}
                  <div className="absolute left-[clamp(140px,19.31vw,278px)] bottom-[clamp(22px,2.92vw,42px)] w-0 h-[clamp(40px,4.38vw,63px)] border-l border-[#333333] opacity-20"></div>

                  {/* Информация о туре */}
                  <div className="absolute left-[clamp(180px,22.78vw,328px)] bottom-[clamp(20px,2.78vw,40px)]">
                    <div className="flex flex-col gap-[clamp(6px,0.69vw,10px)] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <p className="font-medium leading-[1.35] text-[clamp(18px,1.94vw,28px)] tracking-[-0.02em] whitespace-nowrap">
                        {tour.duration || 0} {t('tour.days')}, {t('tour.upTo')} {(tour.max_participants ?? (tour as any).maxParticipants ?? 15)} {t('tour.people')}
                      </p>
                      <p className="font-medium leading-[1] text-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                        {t('home.popular.planIncludes')}
                      </p>
                    </div>
                  </div>

                  {/* Правая часть - изображение */}
                  <div className="absolute right-[clamp(12px,1.39vw,20px)] top-[clamp(12px,1.39vw,20px)] w-[clamp(280px,31.25vw,450px)] h-[clamp(216px,17.71vw,255px)] rounded-[20px] overflow-hidden">
                    <img
                      src={getTourPrimaryImage(tour)}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
                  </div>

                  {/* Кнопка-стрелка */}
                  <div className="absolute left-[clamp(480px,57.85vw,833px)] top-1/2 -translate-y-1/2 w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)] rounded-full bg-white flex items-center justify-center group-hover:bg-[#8F7B49] transition-colors">
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#333333] group-hover:text-white transition-colors w-[clamp(28px,2.64vw,38px)] h-[clamp(28px,2.64vw,38px)]">
                      <path d="M6.33334 19H31.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22.1667 9.5L31.6667 19L22.1667 28.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Mobile & Small Tablet Layout */}
                <div className="lg:hidden relative">
                  {/* Image on top */}
                  <div className="relative w-full h-[250px] rounded-t-[20px] overflow-hidden">
                    <img
                      src={getTourPrimaryImage(tour)}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
                  </div>

                  {/* Content below */}
                  <div className="p-6 flex flex-col gap-4 text-[#333333]">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-medium leading-[1.3] text-[24px] tracking-[-0.48px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {tour.title}
                      </h3>
                      <p className="font-normal leading-[1.4] text-[16px] tracking-[-0.32px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {tour.location || t('tour.defaultLocation')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333333]/10">
                      <div className="flex flex-col gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <p className="font-medium leading-[1.4] text-[20px] tracking-[-0.4px]">
                          {Number((typeof tour.price === 'object' ? (tour.price as any)?.amount : tour.price) || 0).toLocaleString('ru-RU')} UZS
                        </p>
                        <p className="font-medium leading-[1] text-[14px] tracking-[-0.28px]">
                          {t('tour.from')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <p className="font-medium leading-[1.4] text-[20px] tracking-[-0.4px]">
                          {tour.duration || 0} {t('tour.days')}, {(tour.max_participants ?? (tour as any).maxParticipants ?? 15)} {t('tour.people')}
                        </p>
                        <p className="font-medium leading-[1] text-[14px] tracking-[-0.28px]">
                          {t('home.popular.planIncludes')}
                        </p>
                      </div>
                    </div>

                    {/* Arrow button */}
                    <div className="flex justify-end">
                      <div className="w-[60px] h-[60px] rounded-full bg-white border-2 border-[silver] flex items-center justify-center group-hover:bg-[#8F7B49] group-hover:border-[#8F7B49] transition-colors">
                        <svg width="28" height="28" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#333333] group-hover:text-white transition-colors">
                          <path d="M6.33334 19H31.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22.1667 9.5L31.6667 19L22.1667 28.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
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
            <div className="mt-[clamp(40px,5.56vw,80px)] flex justify-center">
              <button
                className="w-full border-2 border-[silver] rounded-[20px] px-[clamp(24px,2.78vw,40px)] py-[clamp(16px,1.81vw,26px)] flex items-center justify-center font-normal leading-[1.2] text-[clamp(16px,1.39vw,20px)] tracking-[-0.02em] text-[#333333] hover:bg-white/70 transition-colors"
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
