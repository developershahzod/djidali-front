import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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

const aboutImages = [
  '/about-background.png',
  '/2242500ecee2019d2c913d6be87dc645865f15d5.png',
  '/ac5bf1e47e292f5b7f1042422f23e28abae08055.png'
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tours, loading, error } = useTours({ limit: 5 });
  const { t } = useLanguage();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const experienceCards = useMemo(
    () => experienceCardsConfig.map((card) => ({
      ...card,
      title: card.titleKey ? t(card.titleKey) : undefined
    })),
    [t]
  );

  const startImageRotation = useCallback(() => {
    // Очистка существующих интервалов
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);

    const updateInterval = 50; // мс
    const totalDuration = 5000; // мс
    const increment = (100 * updateInterval) / totalDuration;

    // Интервал для обновления прогресса (обновляем каждые 50мс для плавности)
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          // Когда достигаем 100%, переключаем картинку и сбрасываем прогресс
          setActiveImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
          return 0;
        }
        return newProgress;
      });
    }, updateInterval);
  }, []);

  const stopImageRotation = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Intersection Observer для отслеживания видимости блока
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          startImageRotation();
        } else {
          stopImageRotation();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      stopImageRotation();
    };
  }, [startImageRotation, stopImageRotation]);

  return (
    <div className="bg-[#F5F1E6] text-[#2A241C]">
      <HeroSection />

      <section id="about" ref={sectionRef} className="relative bg-white py-0 overflow-hidden">
        <div className="relative h-[900px] max-w-[1440px] mx-auto">
          {/* Background Image on the right */}
          <div className="absolute h-[900px] right-0 top-0 w-[720px]">
            <img
              src={aboutImages[activeImageIndex]}
              alt={t('home.about.imageAlt')}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ transition: 'opacity 0.5s ease-in-out' }}
            />
          </div>

          {/* Content */}
          <div className="relative flex flex-col gap-[20px] items-start left-[50px] top-[80px] w-[540px] text-[#333333]">
            <h2 className="font-medium leading-[60px] text-[60px] tracking-[-1.8px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('home.about.title')}
            </h2>
            <p className="font-normal leading-[40px] text-[32px] tracking-[-0.96px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span>{t('home.about.text1')}</span>
              <span className="text-[#8f7b49]">{t('home.about.highlight')}</span>
              <span>{t('home.about.text2')}</span>
            </p>
          </div>

          {/* Icon */}
          <div className="absolute left-[26px] top-[564px] w-[130px] h-[130px]">
            <div className="relative w-full h-full">
              <div className="absolute" style={{ inset: '23.46% 22.77% 22.05% 18.19%' }}>
                <img src="/about-icon-group1.svg" alt="" className="w-full h-full object-contain" />
              </div>
              <div className="absolute" style={{ inset: '23.46% 36.57% 22.83% 22.64%' }}>
                <img src="/about-icon-group2.svg" alt="" className="w-full h-full object-contain" />
              </div>
              <div className="absolute" style={{ inset: '21.7% 9.09% 41.62% 54.84%' }}>
                <img src="/about-icon-vector.svg" alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="absolute font-medium leading-[28px] left-[50px] text-[#333333] text-[16px] top-[702px] tracking-[-0.48px] w-[503px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('home.about.bottomText')}
          </p>

          {/* Pagination */}
          <div className="absolute left-[50px] top-[850px] w-[380px] h-[3px] flex gap-[13px]">
            {aboutImages.map((_, index) => (
              <div
                key={index}
                className="relative h-[3px] rounded-full"
                style={{
                  width: '117px',
                  background: 'rgba(51, 51, 51, 0.1)'
                }}
              >
                {index === activeImageIndex && (
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: '#333333',
                      transition: 'width 0.05s linear'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tours" className="bg-[#F4F2ED] py-24">
        <div className="max-w-[1440px] mx-auto px-[50px]">
          <div className="flex items-end justify-between mb-[100px]">
            <h2 className="font-medium leading-[60px] text-[60px] tracking-[-1.8px] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('home.popular.heading')}
            </h2>
            <p className="font-light leading-[28px] text-[20px] tracking-[-0.4px] text-[#333333] whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('home.popular.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-[20px]">
            {loading && (
              <div className="flex justify-center py-16">
                <span className="text-[#333333] text-base">{t('home.popular.loading')}</span>
              </div>
            )}

            {error && !loading && (
              <div className="bg-[#FCE8E6] border border-[#F5B1A8] text-[#8C342A] rounded-[20px] px-8 py-6 text-center">
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
                    {Number(tour.price || 0).toLocaleString('ru-RU')} UZS
                  </p>
                  <p className="font-medium leading-[16px] text-[16px] tracking-[-0.32px]">
                    {t('home.popular.from')}
                  </p>
                </div>

                {/* Вертикальный разделитель */}
                <div className="absolute left-[278px] top-[193px] w-0 h-[63px] border-l border-[#333333] opacity-20"></div>

                {/* Информация о туре */}
                <div className="absolute left-[328px] top-[191px]">
                  <div className="flex flex-col gap-[10px] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <p className="font-medium leading-[38px] text-[28px] tracking-[-0.56px] whitespace-nowrap">
                      {t('home.popular.daysAndPeople')
                        .replace('{duration}', String(tour.duration || 0))
                        .replace('{people}', String(tour.max_participants || 15))}
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
                  {(tour.type || tour.badge) && (
                    <div className="absolute bottom-[32px] right-[32px] bg-white rounded-[16px] px-[6px] py-[2px] z-10">
                      <p className="font-medium leading-[16px] text-[16px] tracking-[-0.32px] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {tour.type || tour.badge}
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

            {!loading && !error && tours.length === 0 && (
              <div className="rounded-[20px] bg-white/80 border-2 border-[silver] px-8 py-10 text-center text-[#333333]">
                {t('home.popular.emptyState')}
              </div>
            )}
          </div>

          <div className="mt-[80px] flex justify-center">
            <button
              className="w-full border-2 border-[silver] rounded-[20px] px-[40px] py-[26px] flex items-center justify-center font-normal leading-[24px] text-[20px] tracking-[-0.4px] text-[#333333] hover:bg-white/70 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              onClick={() => navigate('/tours')}
            >
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