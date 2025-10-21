import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TourFilters } from '../pages/TourListPage';

const labelClasses = 'block text-[clamp(12px,0.97vw,14px)] font-medium leading-[1.43] text-[#333333] opacity-50 mb-0 tracking-[-0.02em]';
const selectClasses = 'w-full appearance-none bg-transparent text-[clamp(18px,1.53vw,22px)] font-semibold leading-[1.09] text-[#333333] outline-none tracking-[-0.02em]';
const cardWrapper = 'rounded-[10px] bg-white px-[clamp(12px,1.39vw,20px)] py-[clamp(12px,1.25vw,18px)] border-2 border-solid border-white h-[clamp(60px,5.56vw,80px)] flex flex-col gap-[clamp(2px,0.21vw,3px)] items-start justify-start';

interface TourListHeroProps {
  filters: TourFilters;
  onFilterChange: (filters: Partial<TourFilters>) => void;
  onSearch: () => void;
}

const TourListHero: React.FC<TourListHeroProps> = ({ filters, onFilterChange, onSearch }) => {
  const { t, translate } = useLanguage();

  const countryOptions = useMemo(
    () => [
      { value: 'tashkent', label: translate({ ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent' }) },
      { value: 'samarkand', label: translate({ ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand' }) },
      { value: 'bukhara', label: translate({ ru: 'Бухара', uz: 'Buxoro', en: 'Bukhara' }) },
      { value: 'khiva', label: translate({ ru: 'Хива', uz: 'Xiva', en: 'Khiva' }) }
    ],
    [translate]
  );

  const tourTypeOptions = useMemo(
    () => [
      { value: 'eco', label: t('hero.multiDay') },
      { value: 'hunting', label: t('hero.hunting') },
      { value: 'agro', label: t('hero.agro') },
      { value: 'team', label: t('hero.teamBuilding') }
    ],
    [t]
  );

  const dateOptions = useMemo(
    () => [
      { value: 'sep-12-20', label: t('hero.rangeSep12To20') },
      { value: 'sep-21-30', label: t('hero.rangeSep21To30') },
      { value: 'oct-1-10', label: t('hero.rangeOct01To10') }
    ],
    [t]
  );

  const participantOptions = useMemo(
    () => [
      { value: 'family', label: t('hero.participantsFamily') },
      { value: 'solo', label: t('hero.participantsSolo') },
      { value: 'couple', label: t('hero.participantsCouple') },
      { value: 'group', label: t('hero.participantsGroup') }
    ],
    [t]
  );

  return (
    <section
      className="relative overflow-hidden bg-[#B4A785] text-white min-h-[clamp(500px,48.61vw,700px)] pb-[clamp(40px,2.78vw,0px)] lg:pb-0"
    >
      {/* Decorative Wave Element */}
      <div className="hidden lg:block absolute left-1/2 top-[clamp(60px,6.88vw,99px)] w-[clamp(900px,104.31vw,1502px)] h-[clamp(150px,17.15vw,247px)] -translate-x-1/2">
        <img
          src="/tour-hero-wave.svg"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      {/* Search Container */}
      <div className="relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[clamp(300px,32.36vw,466px)] w-full max-w-[min(1350px,93.75vw)] px-[clamp(20px,1.67vw,24px)] lg:px-0 pt-[clamp(120px,13.89vw,200px)] lg:pt-0">
        <div className="flex flex-col lg:flex-row gap-[clamp(8px,0.69vw,10px)] items-stretch lg:items-center">
          {/* Country Field */}
          <div className={`${cardWrapper} flex-1 min-w-0`}>
            <label className={labelClasses}>{t('hero.countryLabel')}</label>
            <select value={filters.country} onChange={(event) => onFilterChange({ country: event.target.value })} className={selectClasses}>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tour Type Field */}
          <div className={`${cardWrapper} flex-1 min-w-0`}>
            <label className={labelClasses}>{t('hero.tourTypeLabel')}</label>
            <select value={filters.tourType} onChange={(event) => onFilterChange({ tourType: event.target.value })} className={selectClasses}>
              {tourTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Field */}
          <div className={`${cardWrapper} flex-1 min-w-0`}>
            <label className={labelClasses}>{t('hero.dateLabel')}</label>
            <select value={filters.date} onChange={(event) => onFilterChange({ date: event.target.value })} className={selectClasses}>
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Participants Field */}
          <div className={`${cardWrapper} flex-1 min-w-0`}>
            <label className={labelClasses}>{t('hero.participantsLabel')}</label>
            <select value={filters.participants} onChange={(event) => onFilterChange({ participants: event.target.value })} className={selectClasses}>
              {participantOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="rounded-[10px] bg-[#8F7B49] w-full lg:w-[clamp(140px,12.5vw,180px)] h-[clamp(60px,5.56vw,80px)] flex items-center justify-center text-white text-[clamp(16px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] transition-all hover:bg-[#7B6A3D]"
          >
            {t('hero.findTours')}
          </button>
        </div>
      </div>

      {/* Available Directions Text */}
      <p className="hidden lg:block absolute bottom-[clamp(30px,3.47vw,50px)] right-[clamp(30px,3.47vw,50px)] text-white text-[clamp(16px,1.39vw,20px)] leading-[1.4] tracking-[-0.02em] text-right">
        <span className="font-bold">{t('tourList.availableDirectionsBold')}</span>
        <span className="font-light"> {t('tourList.availableDirectionsLight')}</span>
      </p>
    </section>
  );
};


export default TourListHero;
