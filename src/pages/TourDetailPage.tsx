import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTourPrimaryImage } from '../utils/imageUtils';
import { useTour } from '../hooks/useTours';
import { useLanguage } from '../contexts/LanguageContext';
import TourRegistrationForm from '../components/TourRegistrationForm';
import { useAuth } from '../contexts/AuthContext';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, translate } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { tour, loading, error } = useTour(id ?? null);

  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleOpenRegistration = useCallback(() => {
    setShowRegistration(true);
  }, []);

  const handleCloseRegistration = useCallback(() => {
    setShowRegistration(false);
  }, []);

  const primaryImage = useMemo(() => (tour ? getTourPrimaryImage(tour) : ''), [tour]);

  const heroHighlights = useMemo(() => {
    if (!tour) {
      return [];
    }

    return [
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 1v22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
        label: t('tour.priceFrom'),
        value: `${Number((typeof tour.price === 'object' ? tour.price?.amount : tour.price) ?? 0).toLocaleString('ru-RU')} UZS`
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 16 14" />
          </svg>
        ),
        label: t('tour.durationLabel'),
        value: `${tour.duration ?? 0} ${t('tour.days')}`
      }
    ];
  }, [tour, t]);

  const capabilityCards = useMemo(() => {
    if (!tour) {
      return [];
    }

    return [
      {
        title: t('tour.people'),
        description: `${t('tour.upTo')} ${tour.max_participants ?? (tour as any).maxParticipants ?? 10}`
      },
      {
        title: t('tour.minAge'),
        description: tour.min_age ? `${t('tour.from')} ${tour.min_age} ${t('tour.years')}` : t('tour.defaultMinAge')
      },
      {
        title: t('tour.type'),
        description: tour.category?.name || t('tour.defaultType')
      },
      {
        title: t('tour.difficulty'),
        description: tour.difficulty || t('tour.defaultDifficulty')
      }
    ];
  }, [tour, t]);

  const galleryImages = useMemo(() => {
    if (!tour) {
      return [];
    }

    const images =
      tour.images?.map((image) => {
        if (typeof image === 'string') {
          return image;
        }

        if (image && typeof image === 'object') {
          if ('image_url' in image && (image as { image_url?: string }).image_url) {
            return (image as { image_url: string }).image_url;
          }

          if ('url' in image && (image as { url?: string }).url) {
            return (image as { url: string }).url;
          }
        }

        return '';
      }).filter(Boolean) ?? [];

    if (!images.length && primaryImage) {
      return [primaryImage];
    }

    return images;
  }, [tour, primaryImage]);

  const itineraryItems = useMemo<ItineraryItem[]>(() => {
    if (!tour) {
      return [];
    }

    if (tour.itinerary && tour.itinerary.length > 0) {
      return [...tour.itinerary]
        .map((item) => ({
          day: item.day,
          title: item.title,
          description: item.description
        }))
        .sort((a, b) => a.day - b.day);
    }

    if (tour.itinerary && !Array.isArray(tour.itinerary) && typeof tour.itinerary === 'object') {
      return Object.entries(tour.itinerary)
        .map(([key, value], index) => {
          const numericDay = parseInt(key.replace(/\D/g, ''), 10);

          return {
            day: Number.isNaN(numericDay) ? index + 1 : numericDay,
            title: key,
            description: typeof value === 'string' ? value : String(value)
          };
        })
        .sort((a, b) => a.day - b.day);
    }

    return [];
  }, [tour]);

  useEffect(() => {
    if (itineraryItems.length > 0 && activeDay === null) {
      setActiveDay(itineraryItems[0].day);
    }
  }, [itineraryItems, activeDay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-[#F5F1E6] flex items-center justify-center px-6">
        <div className="max-w-xl text-center space-y-6">
          <h2 className="text-[2rem] font-light text-[#2A241C]">Не удалось загрузить тур</h2>
          <p className="text-base text-[#6B6459]">{error || 'Попробуйте обновить страницу или вернуться позже.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full border border-[#CBB48F] px-8 py-3 text-sm font-medium text-[#3A3124] hover:bg-[#F2EBE0] transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E6] text-[#2A241C] font-sans">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {primaryImage && (
            <img src={primaryImage} alt={tour.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/55" />
        </div>

        <div className="relative max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 pt-40 pb-24 space-y-12 text-white">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Назад
          </button>

          <div className="space-y-6">
            <h1 className="text-[3.5rem] leading-[1.1] font-light max-w-3xl">{tour.title}</h1>

            <div className="flex flex-wrap items-start gap-8 text-white/90">
              {heroHighlights.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-lg font-light">{item.value}</div>
                    <div className="text-xs text-white/70 mt-1">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-white/70">
              {tour.location || t('tour.defaultDetailLocation')}
            </div>
          </div>

          <div className="bg-white text-[#2A241C] rounded-[32px] shadow-[0_40px_90px_-60px_rgba(32,24,12,0.65)] px-6 py-10 lg:px-12 lg:py-12 space-y-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityCards.map((card) => (
                <div key={card.title} className="rounded-[24px] border border-[#E4D7C0] px-6 py-5 bg-[#F9F4EA]">
                  <div className="text-xs text-[#A38D66] opacity-80 mb-1">{card.title}</div>
                  <div className="text-lg font-medium text-[#2C2319]">{card.description}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <div className="rounded-[28px] border border-[#E4D7C0] bg-[#FBF7F0] p-8 shadow-[0_28px_65px_-45px_rgba(38,28,18,0.45)]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#B4965A]/15 px-4 py-1 text-xs font-semibold text-[#8F6E47]">
                      {t('tour.bookingTitle')}
                    </span>
                    <p className="text-base leading-7 text-[#5A4A38]">
                      {t('tour.bookingDescription')}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-white/60 bg-white/80 p-4 shadow-inner">
                      <div className="text-xs text-[#B4965A] uppercase">{t('tour.priceFrom')}</div>
                      <div className="mt-2 text-2xl font-semibold text-[#2C2319]">
                        {Number((typeof tour.price === 'object' ? tour.price?.amount : tour.price) ?? 0).toLocaleString('ru-RU')} UZS
                      </div>
                    </div>
                    <div className="rounded-[20px] border border-white/60 bg-white/80 p-4 shadow-inner">
                      <div className="text-xs text-[#B4965A] uppercase">{t('tour.durationLabel')}</div>
                      <div className="mt-2 text-2xl font-semibold text-[#2C2319]">{tour.duration ?? 0} {t('tour.days')}</div>
                    </div>
                  </div>

                  <div className="rounded-[20px] bg-white/90 p-5 space-y-3 text-sm text-[#5F4A31]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#857157]">{t('tour.people')}</span>
                      <span className="font-medium text-[#2C2319]">
                        {t('tour.upTo')} {tour.max_participants ?? (tour as any).maxParticipants ?? 10}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#857157]">{t('tour.type')}</span>
                      <span className="font-medium text-[#2C2319]">{tour.category?.name || t('tour.defaultType')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#857157]">{t('tour.minAge')}</span>
                      <span className="font-medium text-[#2C2319]">
                        {tour.min_age ? `${t('tour.from')} ${tour.min_age} ${t('tour.years')}` : t('tour.defaultMinAge')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E4D7C0] bg-white p-8 shadow-[0_20px_60px_-40px_rgba(38,28,18,0.35)] flex flex-col gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#2C2319]">{tour.location || t('tour.defaultDetailLocation')}</h3>
                  <p className="text-sm text-[#7A6A52]">
                    {t('tour.program')}
                  </p>
                </div>

                <div className="rounded-[20px] border border-[#E4D7C0] bg-[#FBF4E6] p-5 text-sm text-[#5F4A31]">
                  <p className="font-medium text-[#2F261C]">Click</p>
                  <p className="mt-2 leading-6">
                    {t('tour.bookingDescription')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenRegistration}
                  className="flex items-center justify-center gap-2 rounded-[18px] bg-[#B4965A] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-18px_rgба(44,32,18,0.65)] transition-all hover:-translate-y-[2px] hover:bg-[#A7894F]"
                >
                  {isAuthenticated ? t('tour.bookNow') : t('tour.loginToBook')}
                </button>
                <TourRegistrationForm tour={tour} isOpen={showRegistration} onClose={handleCloseRegistration} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 py-24 space-y-10">
          <div className="space-y-6">
            <h2 className="text-[2.8rem] leading-tight font-light text-[#2A241C]">{t('tour.about')}</h2>
            {tour.description ? (
              <p className="text-lg leading-8 text-[#51483B] max-w-4xl whitespace-pre-line">{tour.description}</p>
            ) : (
              <p className="text-lg leading-8 text-[#51483B] max-w-4xl">{t('tour.descriptionFallback')}</p>
            )}
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-normal text-[#2A241C] mb-4">{t('tour.included')}</h3>
              <ul className="space-y-2 text-[#51483B] text-base">
                {(tour.included && tour.included.length > 0
                  ? tour.included
                  : [
                      t('tour.defaultIncluded1'),
                      t('tour.defaultIncluded2'),
                      t('tour.defaultIncluded3'),
                      t('tour.defaultIncluded4'),
                      t('tour.defaultIncluded5')
                    ]
                ).map((item) => (
                  <li key={`included-${item}`} className="flex gap-3">
                    <span className="text-[#8B7355]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-normal text-[#2A241C] mb-4">{t('tour.excluded')}</h3>
              <ul className="space-y-2 text-[#51483B] text-base">
                {(tour.excluded && tour.excluded.length > 0
                  ? tour.excluded
                  : [
                      t('tour.defaultExcluded1'),
                      t('tour.defaultExcluded2'),
                      t('tour.defaultExcluded3'),
                      t('tour.defaultExcluded4'),
                      t('tour.defaultExcluded5')
                    ]
                ).map((item) => (
                  <li key={`excluded-${item}`} className="flex gap-3">
                    <span className="text-[#8B7355]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#F1E9D9] py-24">
          <div className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 space-y-12">
            <h2 className="text-[2.8rem] leading-tight font-light text-[#2A241C]">{t('tour.moments')}</h2>

            <div className="space-y-6">
              {galleryImages[0] && (
                <div className="h-[360px] overflow-hidden shadow-[0_35px_80px_-60px_rgba(30,24,16,0.55)]">
                  <img src={galleryImages[0]} alt={tour.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {(galleryImages.length > 1 ? galleryImages.slice(1, 3) : [primaryImage, primaryImage])
                  .filter(Boolean)
                  .map((image, index) => (
                    <div key={`gallery-${index}`} className="h-[260px] overflow-hidden shadow-[0_25px_70px_-55px_rgba(30,24,16,0.45)]">
                      <img src={image as string} alt={`${tour.title} момент ${index + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 py-24 space-y-10">
          <h2 className="text-[2.8rem] leading-tight font-light text-[#2A241C]">{t('tour.program')}</h2>

          <div className="space-y-3">
            {itineraryItems.map((item) => {
              const isOpen = activeDay === item.day;

              return (
                <div key={item.day} className="rounded-[20px] border border-[#E4D7C0] bg-[#FBF6EA] shadow-[0_20px_60px_-50px_rgba(38,28,18,0.45)]">
                  <button
                    onClick={() => setActiveDay(isOpen ? null : item.day)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <div>
                      <div className="text-sm uppercase tracking-[0.3em] text-[#A38D66]">{t('tour.day')} {item.day}</div>
                      <div className="text-base text-[#2C2319] mt-1">{item.title.replace(/^День\s*\d+\s*/i, '').trim() || item.title}</div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-[#8B7355] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-base text-[#51483B] leading-relaxed">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      
      </main>
    </div>
  );
};



export default TourDetailPage;