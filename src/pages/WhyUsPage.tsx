import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WhyUsPage: React.FC = () => {
  const { t } = useLanguage();

  const heroStats = useMemo(
    () => [
      { value: '180', subtitle: t('whyUs.hero.statTravelers') },
      { value: '64+', subtitle: t('whyUs.hero.statPackages') },
      { value: '10+', subtitle: t('whyUs.hero.statYears') }
    ],
    [t]
  );

  const heroChips = useMemo(
    () => [
      { label: t('whyUs.hero.primaryCta'), primary: true },
      { label: t('home.experience.nature') },
      { label: t('home.experience.comfort') },
      { label: t('home.experience.team') }
    ],
    [t]
  );
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1C160D]">
      <header className="relative h-[620px] overflow-hidden pt-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/23e816450b81f83b8e9040941056ad7b494b194b.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 max-w-[1260px] mx-auto px-6 lg:px-12 xl:px-0 h-full flex flex-col justify-between py-24">
          <div className="flex items-center justify-between text-white text-sm tracking-[0.3em] uppercase">
            <span>{t('whyUs.hero.tagline')}</span>
            <div className="flex items-center gap-6">
              {heroStats.map((item, index) => (
                <React.Fragment key={item.value}>
                  {index > 0 && <span className="h-10 w-px bg-white/20 hidden lg:block" />}
                  <span className="hidden lg:flex items-center gap-2 text-white/80">
                    <span className="text-[2.8rem] leading-none font-medium text-white">{item.value}</span>
                    <span className="text-xs uppercase tracking-[0.35em]">{item.subtitle}</span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="max-w-[720px] space-y-6 text-white">
            <h1 className="text-[3.5rem] leading-[1.15] font-light">{t('whyUs.hero.title')}</h1>
            <p className="text-lg text-white/80">{t('whyUs.hero.description')}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {heroChips.map(({ label, primary }) => (
              <button
                key={label}
                className={`px-6 py-3 rounded-full text-sm uppercase tracking-[0.2em] ${
                  primary ? 'bg-[#9F865C] shadow-lg text-white' : 'bg-white/15 text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[1260px] mx-auto px-6 lg:px-12 xl:px-0 py-24 space-y-16">
        <section id="team" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[3rem] font-light text-[#1C160D]">{t('whyUs.section1.title')}</h2>
            <p className="text-lg leading-8 text-[#51483B] max-w-3xl">{t('whyUs.section1.paragraph1')}</p>
            <p className="text-lg leading-8 text-[#51483B] max-w-3xl">{t('whyUs.section1.paragraph2')}</p>
          </div>

          <div className="bg-white shadow-[0_40px_80px_-60px_rgba(31,23,15,0.45)]">
            <img src="/photo_5445168424612397991_w.jpg" alt={t('whyUs.gallery.altForestPath')} className="w-full h-[420px] object-cover" />
          </div>
        </section>

        <section id="routes" className="space-y-8">
          <p className="text-lg leading-8 text-[#51483B] max-w-4xl">{t('whyUs.section2.paragraph')}</p>

          <div className="grid gap-6 md:grid-cols-2">
            <img src="/ac5bf1e47e292f5b7f1042422f23e28abae08055.png" alt={t('whyUs.gallery.altMountain')} className="h-[300px] object-cover w-full" />
            <img src="/ed4884c607a0c0a9448a1821b729baf1a9d7aac2 (1).png" alt={t('whyUs.gallery.altCanyon')} className="h-[300px] object-cover w-full" />
            <img src="/93522f075cfbf738bf0e6a03aae5960be5915125 (1).png" alt={t('whyUs.gallery.altRiverValley')} className="h-[300px] object-cover w-full" />
            <img src="/7088cf1a8af0594b39ad37c91187893b3901bd02.png" alt={t('whyUs.gallery.altRockyRoute')} className="h-[300px] object-cover w-full" />
            <img src="/photo_5445168424612397993_y.jpg" alt={t('whyUs.gallery.altLandscape')} className="h-[300px] object-cover w-full md:col-span-2" />
          </div>
        </section>

        <section className="space-y-8">
          <p className="text-lg leading-8 text-[#51483B] max-w-4xl">{t('whyUs.section3.paragraph')}</p>

          <div className="grid gap-6 md:grid-cols-2">
            <img src="/photo_5445168424612397996_y.jpg" alt={t('whyUs.gallery.altField')} className="h-[300px] object-cover w-full" />
            <img src="/photo_5445168424612397992_y.jpg" alt={t('whyUs.gallery.altThicket')} className="h-[300px] object-cover w-full" />
            <img src="/photo_5445168424612398617_w.jpg" alt={t('whyUs.gallery.altLandscape')} className="h-[300px] object-cover w-full" />
            <img src="/ac5bf1e47e292f5b7f1042422f23e28abae08055.png" alt={t('whyUs.gallery.altForestMassif')} className="h-[300px] object-cover w-full" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default WhyUsPage;
