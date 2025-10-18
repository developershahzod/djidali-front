import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { useTours } from '../hooks/useTours';
import { getTourPrimaryImage } from '../utils/imageUtils';
import { useLanguage } from '../contexts/LanguageContext';

const experienceCardsConfig = [
  {
    id: 'why-us',
    type: 'text'
  },
  {
    id: 'team',
    titleKey: 'home.experience.team',
    image: '/7088cf1a8af0594b39ad37c91187893b3901bd02.png'
  },
  {
    id: 'nature',
    titleKey: 'home.experience.nature',
    image: '/5c23a46fdfc50a24d0c3643979b5cb5f43cf5928.png'
  },
  {
    id: 'comfort',
    titleKey: 'home.experience.comfort',
    image: '/2242500ecee2019d2c913d6be87dc645865f15d5.png'
  },
  {
    id: 'routes',
    titleKey: 'home.experience.routes',
    image: '/ac5bf1e47e292f5b7f1042422f23e28abae08055.png'
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tours, loading, error } = useTours({ limit: 5 });
  const { t, translate } = useLanguage();

  const experienceCards = useMemo(
    () => experienceCardsConfig.map((card) => ({
      ...card,
      title: card.titleKey ? t(card.titleKey) : undefined
    })),
    [t]
  );

  return (
    <div className="bg-[#F5F1E6] text-[#2A241C]">
      <HeroSection />

      <section id="about" className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 py-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch">
          <div className="flex flex-col justify-center">
            <span className="text-sm tracking-[0.3em] uppercase text-[#A38D66] mb-6">{t('home.about.label')}</span>
            <h2 className="text-[3.5rem] leading-[1.1] font-light text-[#1A160F] mb-10">
              {translate({
                ru: 'Мы помогаем вам найти ',
                uz: 'Biz sizga ',
                en: 'We help you find '
              })}
              <span className="text-[#8F764F]">{t('home.about.highlight')}</span>
              {translate({
                ru: ' и открыть красоту природы в её лучших проявлениях.',
                uz: ' va tabiat goʻzalligini eng yorqin koʻrinishlarda kashf etishingizga yordam beramiz.',
                en: ' and discover nature’s beauty at its best.'
              })}
            </h2>
            <div className="flex items-start gap-6">
              {/* <div className="w-16 h-16 rounded-2xl bg-[#F2E5CF] flex items-center justify-center">
                <img src="/sam.jpg" alt="Icon" className="w-10 h-10 object-contain" />
              </div> */}
              <p className="text-lg text-[#5F5A52] leading-relaxed max-w-xl">
                {t('home.about.description')}
              </p>
            </div>
          </div>

          <div className="relative h-[560px] rounded-[36px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(38,28,14,0.45)]">
            <img
              src="/photo_5445168424612398617_w.jpg"
              alt="Природа"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="tours" className="bg-[#ECE5D8] py-24">
        <div className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="text-sm tracking-[0.3em] uppercase text-[#A38D66] block mb-5">{t('home.popular.label')}</span>
              <h2 className="text-[3rem] leading-tight font-light text-[#1A160F]">{t('home.popular.heading')}</h2>
            </div>
            <span className="text-base text-[#7A7466]">{t('home.popular.subtitle')}</span>
          </div>

          <div className="space-y-8">
            {loading && (
              <div className="flex justify-center py-16">
                <span className="text-[#7E7464] text-base">{t('home.popular.loading')}</span>
              </div>
            )}

            {error && !loading && (
              <div className="bg-[#FCE8E6] border border-[#F5B1A8] text-[#8C342A] rounded-3xl px-8 py-6 text-center">
                {t('common.error')} • {error}
              </div>
            )}

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
                className="rounded-[32px] bg-[#F5EFE2] border border-[#E2D7C3] p-8 lg:p-10 xl:p-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-stretch shadow-[0_20px_40px_-35px_rgba(34,27,18,0.35)] cursor-pointer transition-transform hover:-translate-y-1 focus:-translate-y-1 focus:outline-none"
              >
                <div className="flex-1 flex flex-col justify-between gap-10">
                  <div className="space-y-5">
                    <header className="space-y-4">
                      <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm text-[#6C5A40] shadow-sm">
                        {tour.badge || t('home.popular.defaultBadge')}
                      </div>
                      <h3 className="text-[2rem] lg:text-[2.3rem] leading-[1.2] font-normal text-[#20190F]">
                        {tour.title}
                      </h3>
                      <p className="text-base text-[#726A5C] max-w-xl leading-relaxed">
                        {tour.location || t('tour.defaultLocation')}
                      </p>
                    </header>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[2.8rem] font-medium text-[#1E150A]">
                        {Number(tour.price || 0).toLocaleString('ru-RU')}
                      </span>
                      <span className="text-base text-[#7E7464]">UZS</span>
                      <span className="text-sm text-[#B3A588]">{t('tour.from')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#867D6E]">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base">{tour.duration || 0} {t('tour.days')}, {t('tour.upTo')} {(tour.max_participants ?? (tour as any).maxParticipants ?? 15)} {t('tour.people')}</span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full lg:w-[320px] xl:w-[360px] h-[220px] lg:h-auto">
                  <div className="absolute inset-0 rounded-[28px] overflow-hidden">
                    <img src={getTourPrimaryImage(tour)} alt={tour.title} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/tour/${tour.id}`);
                    }}
                    className="absolute bottom-8 right-8 w-28 h-16 rounded-full bg-white/95 text-[#292118] shadow-lg flex items-center justify-center gap-2 text-sm font-medium transition-transform hover:-translate-y-1"
                  >
                    <span>{t('common.view')}</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}

            {!loading && !error && tours.length === 0 && (
              <div className="rounded-[32px] bg-white/80 border border-[#E2D7C3] px-8 py-10 text-center text-[#726A5C]">
                {t('home.popular.emptyState')}
              </div>
            )}
          </div>

          <div className="mt-16 flex justify-center">
            <button className="px-12 py-4 text-base text-[#4A4031] border border-[#D6C6A9] rounded-full hover:bg-white/70 transition-colors" onClick={() => navigate('/tours')}>
              {t('home.popular.viewAll')}
            </button>
          </div>
        </div>
      </section>

      <section id="why-us" className="max-w-[1250px] mx-auto px-6 lg:px-12 xl:px-0 py-28">
        <div className="flex flex-col gap-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm tracking-[0.3em] uppercase text-[#A38D66] block mb-5">{t('home.whyUs.label')}</span>
              <h2 className="text-[3rem] leading-tight font-light text-[#1A160F]">{t('home.whyUs.heading')}</h2>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[#7D715F]">
              <div className="w-10 h-10 rounded-full bg-[#C5B08E] flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4l7 6-7 6V4z" />
                </svg>
              </div>
              <span className="text-base">{t('home.whyUs.subtitle')}</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-8">
              <div className="rounded-[32px] bg-[#C4AD84] text-white p-12 flex flex-col justify-between min-h-[320px]">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mb-10">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5" />
                    <path d="M5 12l7-7 7 7" />
                  </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[2.5rem] leading-tight font-light">{t('home.whyUs.cardTitle')}</h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    {t('home.whyUs.cardDescription')}
                  </p>
                </div>
              </div>

              <ExperienceCard {...experienceCards[2]} />
            </div>

            <div className="grid gap-8">
              <ExperienceCard {...experienceCards[1]} />
              <div className="grid gap-8 lg:grid-cols-2">
                <ExperienceCard {...experienceCards[3]} />
                <ExperienceCard {...experienceCards[4]} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface ExperienceCardProps {
  id: string;
  title?: string;
  image?: string;
  type?: 'text';
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ type, title, image }) => {
  if (type === 'text') {
    return null;
  }

  return (
    <div className="relative rounded-[32px] overflow-hidden min-h-[320px]">
      {image && (
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="relative z-10 h-full flex items-end">
        <div className="p-10">
          <h3 className="text-white text-[1.9rem] leading-tight font-light max-w-xs">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default HomePage;