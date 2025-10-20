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
      <header className="relative h-[clamp(600px,62.5vw,900px)] overflow-hidden">
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
          <div className="absolute left-[clamp(20px,3.47vw,50px)] top-[clamp(100px,14.58vw,210px)] w-[clamp(90%,93.06vw,1340px)] text-white">
            <h1
              className="text-[clamp(40px,6.25vw,90px)] font-medium leading-[1.11] mb-[clamp(12px,1.39vw,20px)]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.03em'
              }}
            >
              {t('whyUs.hero.title')}
            </h1>
            <p
              className="text-[clamp(18px,2.22vw,32px)] font-normal leading-[1.25] opacity-80 whitespace-pre-wrap"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.03em'
              }}
            >
              {t('whyUs.hero.description')}
            </p>
          </div>

          {/* Statistics */}
          <div className="absolute left-[clamp(20px,3.47vw,50px)] top-[clamp(400px,50.14vw,722px)] flex flex-col md:flex-row gap-[clamp(30px,5.56vw,80px)] text-white">
            {heroStats.map((stat, index) => (
              <div key={index} className="w-[clamp(180px,21.11vw,304px)]">
                <div
                  className="mb-[clamp(6px,0.69vw,10px)] whitespace-nowrap"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.0125em'
                  }}
                >
                  <span className="text-[clamp(50px,5.56vw,80px)] font-normal leading-[1]">{stat.value}</span>
                  <span className="text-[clamp(30px,3.47vw,50px)] font-extralight leading-[1]"> {stat.suffix}</span>
                </div>
                <p
                  className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.02em'
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
      <main className="bg-[#F5F5F0] px-[clamp(20px,3.47vw,50px)] py-[clamp(40px,5.56vw,80px)]">
        {/* Section 1: Discover unique itineraries */}
        <section className="flex flex-col gap-[clamp(20px,2.78vw,40px)] mb-[clamp(40px,5.56vw,80px)]">
          <h2
            className="text-[clamp(32px,4.17vw,60px)] font-medium leading-[1] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.03em'
            }}
          >
            {t('whyUs.section1.title')}
          </h2>
          <div
            className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            <p className="mb-0">{t('whyUs.section1.text1')}</p>
            <p className="mb-0">{t('whyUs.section1.text2')}</p>
            <p>{t('whyUs.section1.text3')}</p>
          </div>
        </section>

        {/* Section 2: Routes for everyone */}
        <section className="mb-[clamp(40px,5.56vw,80px)]">
          <div
            className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            <p className="mb-0">{t('whyUs.section2.text1')}</p>
            <p>{t('whyUs.section2.text2')}</p>
          </div>
        </section>

        {/* Section 3: DJIDALI philosophy */}
        <section className="mb-[clamp(40px,5.56vw,80px)]">
          <div className="flex flex-col gap-[clamp(8px,0.83vw,12px)]">
            <h3
              className="text-[clamp(24px,2.22vw,32px)] font-medium leading-[1.25] text-[#333333]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              {t('whyUs.section3.title')}
            </h3>
            <p
              className="text-[clamp(16px,1.67vw,24px)] font-normal leading-[1.67] text-[#333333]"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              {t('whyUs.section3.text')}
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section>
          {/* Top Image */}
          <div className="relative h-[clamp(300px,34.72vw,500px)] w-full rounded-t-[20px] overflow-hidden">
            <img
              src="/why-us-gallery-top.webp"
              alt={t('whyUs.gallery.altForestPath')}
              className="absolute w-full h-full object-cover"
            />
          </div>

          {/* Bottom Images */}
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-[clamp(350px,40.69vw,586px)] overflow-hidden md:rounded-bl-[20px] rounded-b-[20px] md:rounded-br-none">
              <img
                src="/why-us-gallery-bottom-left.webp"
                alt={t('whyUs.gallery.altRiverValley')}
                className="absolute w-full h-full object-cover"
              />
            </div>
            <div className="relative w-full md:w-1/2 h-[clamp(350px,40.69vw,586px)] overflow-hidden rounded-b-[20px] md:rounded-bl-none md:rounded-br-[20px]">
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
