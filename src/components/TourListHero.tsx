import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const labelClasses = 'block text-[0.6rem] font-semibold tracking-[0.35em] uppercase text-[#A28A66] mb-2';
const selectClasses = 'w-full appearance-none bg-transparent text-[1.05rem] font-medium text-[#2F281F] outline-none';
const cardWrapper = 'rounded-[20px] bg-white px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] border border-white/40';

const TourListHero: React.FC = () => {
  const { t, translate } = useLanguage();
  const [country, setCountry] = useState('tashkent');
  const [tourType, setTourType] = useState('eco');
  const [date, setDate] = useState('sep-12-20');
  const [participants, setParticipants] = useState('family');

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
      className="relative overflow-hidden bg-[#B4A785] text-white"
      style={{
        paddingTop: 260,
        backgroundImage: "url('/image (9).png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#CBB48D]/60 via-[#BCA57F]/70 to-[#AF946B]/85" />

      <div className="relative max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 pt-16 pb-20">
        <div className="rounded-[28px] bg-white/90 text-[#2A241C] px-6 py-8 lg:px-10 lg:py-10 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.45)]">
          <div className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
            <div className={cardWrapper}>
              <label className={labelClasses}>{t('hero.countryLabel')}</label>
              <select value={country} onChange={(event) => setCountry(event.target.value)} className={selectClasses}>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={cardWrapper}>
              <label className={labelClasses}>{t('hero.tourTypeLabel')}</label>
              <select value={tourType} onChange={(event) => setTourType(event.target.value)} className={selectClasses}>
                {tourTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={cardWrapper}>
              <label className={labelClasses}>{t('hero.dateLabel')}</label>
              <select value={date} onChange={(event) => setDate(event.target.value)} className={selectClasses}>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={cardWrapper}>
              <label className={labelClasses}>{t('hero.participantsLabel')}</label>
              <select value={participants} onChange={(event) => setParticipants(event.target.value)} className={selectClasses}>
                {participantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="self-stretch rounded-[20px] bg-[#8B734E] px-10 text-lg font-medium text-white shadow-[0_18px_30px_-18px_rgba(139,115,78,0.8)] transition-transform hover:-translate-y-0.5 hover:bg-[#7B6341]">
              {t('hero.findTours')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-12 mt-12 text-white/85 text-base">
          <button className="flex items-center gap-3">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5h14M5 10h10M7 15h6" />
            </svg>
            {t('filters.filter')}
          </button>
          <button className="flex items-center gap-3">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 10h14M3 6h14M3 14h14" />
            </svg>
            {t('filters.sort')}
          </button>
          <span className="ml-auto text-sm tracking-[0.3em] uppercase">{t('tourList.availableDirections')}</span>
        </div>
      </div>
    </section>
  );
};


export default TourListHero;
