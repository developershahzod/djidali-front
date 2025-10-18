import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TourListHero from '../components/TourListHero';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTourPrimaryImage } from '../utils/imageUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useTours } from '../hooks/useTours';

const TourListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { tours, loading, error, refetch } = useTours({ limit: 20 });
  const handleRefresh = useMemo(() => () => refetch(), [refetch]);

  return (
    <div className="bg-[#F5F1E6] text-[#2A241C]">
      <TourListHero />

      <main className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 pt-[100px] pb-24 space-y-6">
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" color="emerald" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-[#FCE8E6] border border-[#F5B1A8] text-[#8C342A] rounded-3xl px-8 py-6 text-center">
            {t('common.error')} • {error}
          </div>
        )}

        {!loading && !error && tours.map((tour, index) => (
          <article
            key={tour.id}
            className={`rounded-[32px] border border-[#E4D7C0] bg-[#F7EFE3] flex flex-col md:flex-row items-stretch overflow-hidden shadow-[0_20px_50px_-40px_rgба(34,27,18,0.5)] ${
              index === 1 ? 'border-[#C9B184]' : ''
            } cursor-pointer transition-transform hover:-translate-y-1`}
            onClick={() => navigate(`/tour/${tour.id}`)}
          >
            <div className="flex-1 p-10 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <h2 className="text-[2.1rem] leading-[1.2] font-normal text-[#1E160D]">{tour.title}</h2>
                <p className="text-base text-[#756C5E]">{tour.location || t('tour.defaultLocation')}</p>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-[#6A6153]">
                <div className="flex items-baseline gap-2">
                  <span className="text-[2.6rem] font-medium text-[#20170D]">
                    {Number((typeof tour.price === 'object' ? tour.price?.amount : tour.price) || 0).toLocaleString('ru-RU')}
                  </span>
                  <span className="text-base">{t('common.currencyUzbekSum')}</span>
                  <span className="text-sm text-[#B3A588]">{t('tour.from')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base">{tour.duration || 0} {t('tour.days')}, {t('tour.upTo')} {(tour.max_participants ?? (tour as any).maxParticipants ?? 15)} {t('tour.people')}</span>
                </div>
              </div>
            </div>

            <div className="relative w-full md:w-[320px] lg:w-[360px]">
              <img src={getTourPrimaryImage(tour)} alt={tour.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute bottom-6 right-6 rounded-full bg-white/90 px-5 py-2 text-sm text-[#53472F] shadow-lg">
                  {tour.category?.name || (tour as any).badge || 'Экотуризм'}
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/tour/${tour.id}`);
                  }}
                  className={
                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white text-[#1E160D] shadow-xl flex items-center justify-center transition-transform hover:-translate-y-1'
                  }
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}

        {!loading && !error && tours.length > 0 && (
          <div className="pt-8">
            <button
              onClick={handleRefresh}
              className="mx-auto flex items-center justify-center rounded-full border border-[#D9CCB2] px-12 py-4 text-base text-[#4A4031] hover:bg-white/70 transition-colors"
            >
              {t('common.refresh')}
            </button>
          </div>
        )}
      </main>

  
    </div>
  );
};




export default TourListPage;
