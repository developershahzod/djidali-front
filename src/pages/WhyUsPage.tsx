import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WhyUsPage: React.FC = () => {
  const { t } = useLanguage();

  const heroStats = useMemo(
    () => [
      {
        value: t('whyUs.hero.stat1Value'),
        suffix: t('whyUs.hero.stat1Suffix'),
        label: t('whyUs.hero.stat1Label')
      },
      {
        value: t('whyUs.hero.stat2Value'),
        suffix: t('whyUs.hero.stat2Suffix'),
        label: t('whyUs.hero.stat2Label')
      },
      {
        value: t('whyUs.hero.stat3Value'),
        suffix: t('whyUs.hero.stat3Suffix'),
        label: t('whyUs.hero.stat3Label')
      }
    ],
    [t]
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1C160D]">
      <header className="relative h-[900px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/why-us-hero.webp"
            alt=""
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full">
          {/* Title and Description */}
          <div className="absolute left-[50px] top-[210px] w-[1340px] text-white">
            <h1
              className="text-[90px] font-medium leading-[100px] mb-[20px]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-2.7px'
              }}
            >
              {t('whyUs.hero.title')}
            </h1>
            <p
              className="text-[32px] font-normal leading-[40px] opacity-80 whitespace-pre-wrap"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.96px'
              }}
            >
              {t('whyUs.hero.description')}
            </p>
          </div>

          {/* Statistics */}
          <div className="absolute left-[50px] top-[722px] flex gap-[80px] text-white">
            {heroStats.map((stat, index) => (
              <div key={index} className="w-[304px]">
                <div
                  className="mb-[10px] whitespace-nowrap"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-1px'
                  }}
                >
                  <span className="text-[80px] font-normal leading-[80px]">{stat.value}</span>
                  <span className="text-[50px] font-extralight leading-[80px]"> {stat.suffix}</span>
                </div>
                <p
                  className="text-[20px] font-light leading-[28px]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.4px'
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-[#F5F5F0] px-[50px] py-[80px]">
        {/* Section 1: Discover unique itineraries */}
        <section className="flex flex-col gap-[40px] mb-[80px]">
          <h2
            className="text-[60px] font-medium leading-[60px] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-1.8px'
            }}
          >
            {t('whyUs.section1.title')}
          </h2>
          <div
            className="text-[24px] font-normal leading-[40px] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.48px'
            }}
          >
            <p className="mb-0">{t('whyUs.section1.text1')}</p>
            <p className="mb-0">{t('whyUs.section1.text2')}</p>
            <p>{t('whyUs.section1.text3')}</p>
          </div>
        </section>

        {/* Section 2: Routes for everyone */}
        <section className="mb-[80px]">
          <div
            className="text-[24px] font-normal leading-[40px] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.48px'
            }}
          >
            <p className="mb-0">{t('whyUs.section2.text1')}</p>
            <p>{t('whyUs.section2.text2')}</p>
          </div>
        </section>

        {/* Section 3: DJIDALI philosophy */}
        <section className="mb-[80px]">
          <div className="flex flex-col gap-[12px]">
            <h3
              className="text-[32px] font-medium leading-[40px] text-[#333333]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.64px'
              }}
            >
              {t('whyUs.section3.title')}
            </h3>
            <p
              className="text-[24px] font-normal leading-[40px] text-[#333333]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.48px'
              }}
            >
              {t('whyUs.section3.text')}
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section>
          {/* Top Image */}
          <div className="relative h-[500px] w-full rounded-t-[20px] overflow-hidden">
            <img
              src="/why-us-gallery-top.webp"
              alt={t('whyUs.gallery.altForestPath')}
              className="absolute w-full h-full object-cover"
            />
          </div>

          {/* Bottom Images */}
          <div className="flex">
            <div className="relative w-1/2 h-[586px] overflow-hidden rounded-bl-[20px]">
              <img
                src="/why-us-gallery-bottom-left.webp"
                alt={t('whyUs.gallery.altRiverValley')}
                className="absolute w-full h-full object-cover"
              />
            </div>
            <div className="relative w-1/2 h-[586px] overflow-hidden rounded-br-[20px]">
              <img
                src="/why-us-gallery-bottom-right.webp"
                alt={t('whyUs.gallery.altMountain')}
                className="absolute w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WhyUsPage;
