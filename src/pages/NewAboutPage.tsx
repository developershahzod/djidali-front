import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const NewAboutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const teamMembers = [
    { name: t('aboutPage.team.member1.name'), role: t('aboutPage.team.member1.role'), image: '/about-team-1.webp' },
    { name: t('aboutPage.team.member2.name'), role: t('aboutPage.team.member2.role'), image: '/about-team-2.webp' },
    { name: t('aboutPage.team.member3.name'), role: t('aboutPage.team.member3.role'), image: '/about-team-3.webp' },
    { name: t('aboutPage.team.member4.name'), role: t('aboutPage.team.member4.role'), image: '/about-team-4.webp' },
    { name: t('aboutPage.team.member5.name'), role: t('aboutPage.team.member5.role'), image: '/about-team-5.webp' },
    { name: t('aboutPage.team.member6.name'), role: t('aboutPage.team.member6.role'), image: '/about-team-6.webp' },
  ];

  return (
    <div className="bg-[#f4f2ed]">
      {/* Hero Section */}
      <header className="relative h-[900px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img alt="" className="w-full h-full object-cover" src="/about-hero.webp" />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full">
          <div className="max-w-[1440px] mx-auto h-full px-[50px] flex flex-col justify-end pb-[160px]">
            <div className="flex items-end justify-between">
              {/* Title */}
              <div className="max-w-[998px]">
                <h1
                  className="text-[90px] font-medium leading-[100px] text-white tracking-[-2.7px]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {t('aboutPage.hero.title')}
                </h1>
              </div>

              {/* Stats Card */}
              <div className="flex flex-col gap-[40px] w-[312px]">
                <div className="relative w-[80px] h-[80px]">
                  <img alt="" className="w-full h-full" src="/about-icon-airplane-bg.svg" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px]">
                    <img alt="" className="w-full h-full" src="/about-icon-airplane.svg" />
                  </div>
                </div>
                <div className="flex flex-col gap-[4px] text-white">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span className="text-[50px]">10</span>
                    <span className="text-[50px]"> </span>
                    <span className="font-extralight text-[40px]">{t('aboutPage.hero.statsThousand')}</span>
                  </p>
                  <p
                    className="font-light text-[20px] leading-[28px] tracking-[-0.4px] whitespace-nowrap"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>{t('aboutPage.hero.statsClients').split(' ').slice(0, -1).join(' ')} </span>
                    <span className="font-semibold">{t('aboutPage.hero.statsClients').split(' ').slice(-1)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Help Section */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex">
            {/* Left Content */}
            <div className="w-[720px] py-[80px] px-[50px]">
              <div className="flex flex-col gap-[20px] mb-[40px] text-[#333333]">
                <h2
                  className="text-[60px] font-medium leading-[60px] tracking-[-1.8px]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {t('aboutPage.help.title')}
                </h2>
                <p
                  className="text-[32px] font-normal leading-[40px] tracking-[-0.96px]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {t('aboutPage.help.description')}
                </p>
              </div>
              <button
                onClick={() => navigate('/tours')}
                className="bg-[#8f7b49] hover:bg-[#7a6939] transition-colors rounded-[10px] px-[56px] py-[30px] h-[80px] flex items-center justify-center cursor-pointer"
              >
                <p
                  className="text-white text-[20px] font-bold leading-[20px] tracking-[-0.4px] whitespace-pre"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {t('aboutPage.help.cta')}
                </p>
              </button>

              {/* Mission Icons */}
              <div className="mt-[104px] flex gap-[343px]">
                <div className="w-[90px] h-[90px]">
                  <img src="/about-icon-stewardess.svg" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="w-[90px] h-[90px]">
                  <img src="/about-icon-map.svg" alt="" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="mt-[20px] flex gap-[80px]">
                <div className="flex flex-col gap-[16px] w-[313px] tracking-[-0.48px]">
                  <p
                    className="text-[#0f2825] text-[24px] font-medium leading-[30px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.mission.title')}
                  </p>
                  <p
                    className="text-[#333333] text-[16px] font-normal leading-[28px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.mission.description')}
                  </p>
                </div>

                <div className="flex flex-col gap-[16px] w-[312px] tracking-[-0.48px]">
                  <p
                    className="text-[#0f2825] text-[24px] font-medium leading-[30px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.guide.title')}
                  </p>
                  <p
                    className="text-[#333333] text-[16px] font-normal leading-[28px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.guide.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-[720px] h-[900px]">
              <img alt="" className="w-full h-full object-cover" src="/about-help-image.webp" />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-[#f4f2ed] py-[50px]">
        <div className="max-w-[1440px] mx-auto px-[50px]">
          <div className="relative h-[700px] rounded-[20px] overflow-hidden">
            <img alt="" className="w-full h-full object-cover" src="/professionals-video-bg.webp" />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="bg-[#b4a785]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex">
            {/* Left Image */}
            <div className="w-[720px] h-[650px]">
              <img alt="" className="w-full h-full object-cover" src="/about-professionals-image.webp" />
            </div>

            {/* Right Content */}
            <div className="flex-1 py-[50px] px-[26px] relative">
              <div className="flex flex-col gap-[40px] max-w-[644px]">
                <div
                  className="flex flex-col gap-[20px] text-white font-medium"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <h2 className="text-[60px] leading-[60px] tracking-[-1.8px] whitespace-pre">
                    {t('aboutPage.professionals.title')}
                  </h2>
                  <p className="text-[16px] leading-[28px] tracking-[-0.48px] w-[332px]">
                    <span>{t('aboutPage.professionals.description')} </span>
                    <span className="font-bold">{t('aboutPage.professionals.discount')}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/tours')}
                  className="bg-[#333333] hover:bg-[#1a1a1a] transition-colors rounded-[10px] px-[56px] py-[30px] h-[80px] flex items-center justify-center cursor-pointer"
                >
                  <p
                    className="text-white text-[20px] font-bold leading-[20px] tracking-[-0.4px] whitespace-pre"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.professionals.cta')}
                  </p>
                </button>
              </div>

              <div className="mt-[84px] flex flex-col gap-[40px] max-w-[452px]">
                <div className="flex gap-[27px]">
                  <div className="flex flex-col gap-[10px] text-white w-[225px]">
                    <p
                      className="font-normal leading-[1] tracking-[-1px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span className="text-[50px]">10 </span>
                      <span className="font-extralight text-[40px]">+</span>
                    </p>
                    <p
                      className="text-[20px] font-light leading-[28px] tracking-[-0.4px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t('aboutPage.professionals.statsYears')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[10px] text-white">
                    <p
                      className="font-normal leading-[1] tracking-[-1px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span className="text-[50px]">64 </span>
                      <span className="text-[40px]">+</span>
                    </p>
                    <p
                      className="text-[20px] font-light leading-[28px] tracking-[-0.4px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t('aboutPage.professionals.statsPackages')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px] text-white w-[304px]">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span className="text-[50px]">180 </span>
                    <span className="font-extralight text-[40px]">{t('aboutPage.hero.statsThousand')}</span>
                  </p>
                  <p
                    className="text-[20px] font-light leading-[28px] tracking-[-0.4px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.professionals.statsTravelers')}
                  </p>
                </div>
              </div>

              {/* Earth Icon */}
              <div className="absolute bottom-0 right-0 w-[280px] h-[280px] flex items-center justify-center">
                <div className="rotate-180 scale-y-[-100%]">
                  <div className="relative w-[280px] h-[280px] overflow-hidden">
                    <div className="absolute left-[-280px] w-[560px] h-[560px] top-0">
                      <div className="absolute" style={{ inset: '10% 2.3% 10% 6.67%' }}>
                        <img alt="" className="w-full h-full" src="/about-icon-earth.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#f4f2ed] py-[90px]">
        <div className="max-w-[1440px] mx-auto px-[50px]">
          <h2
            className="text-[60px] font-medium leading-[60px] text-[#333333] tracking-[-1.8px] mb-[100px]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('aboutPage.team.title')}
          </h2>

          <div className="grid grid-cols-3 gap-0">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col">
                <div className="w-full h-[540px]">
                  <img alt={member.name} className="w-full h-full object-cover" src={member.image} />
                </div>
                <div className="bg-white border-2 border-[silver] px-[50px] py-[28px]">
                  <div className="flex flex-col gap-[12px] text-[#333333]">
                    <p
                      className="text-[22px] font-semibold leading-[24px] tracking-[-0.44px] whitespace-pre"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {member.name}
                    </p>
                    <p
                      className="text-[16px] font-medium leading-[16px] tracking-[-0.32px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-[#f4f2ed] pb-[100px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between px-[50px] mb-[100px]">
            <h2
              className="text-[60px] font-medium leading-[60px] text-[#333333] tracking-[-1.8px] whitespace-pre"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {t('aboutPage.gallery.title')}
            </h2>
            <p
              className="text-[20px] font-light leading-[28px] text-[#333333] text-right tracking-[-0.4px] whitespace-pre"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span className="font-bold">14</span>
              <span> {t('aboutPage.gallery.available')}</span>
            </p>
          </div>

          <div className="grid grid-cols-[705px_735px] grid-rows-[450px_450px_700px] gap-0">
            {/* Dalverzin - spans 2 rows */}
            <div className="relative row-span-2 overflow-hidden">
              <div className="absolute inset-0">
                <img alt="" className="w-full h-full object-cover" src="/gallery-dalverzin.webp" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
              <div
                className="absolute bottom-[76px] left-[50px] flex flex-col gap-[10px] text-white font-medium max-w-[605px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <p className="text-[50px] leading-[60px] tracking-[-1.5px]">
                  {t('aboutPage.gallery.dalverzin.title')}
                </p>
                <p className="text-[16px] leading-[28px] tracking-[-0.48px]">
                  {t('aboutPage.gallery.dalverzin.description')}
                </p>
              </div>
            </div>

            {/* Kyzylkum */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <img alt="" className="w-full h-full object-cover" src="/gallery-kyzylkum.webp" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
              <div
                className="absolute bottom-[76px] left-[50px] flex flex-col gap-[10px] text-white font-medium max-w-[635px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <p className="text-[50px] leading-[60px] tracking-[-1.5px]">
                  {t('aboutPage.gallery.kyzylkum.title')}
                </p>
                <p className="text-[16px] leading-[28px] tracking-[-0.48px] whitespace-pre">
                  {t('aboutPage.gallery.kyzylkum.description')}
                </p>
              </div>
            </div>

            {/* Video Section */}
            <div className="relative bg-[#cbc2ab]">
              <button
                onClick={() => navigate('/tours')}
                className="absolute bottom-[40px] left-[50px] flex items-center gap-[30px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="relative w-[90px] h-[90px]">
                  <img alt="" className="w-full h-full" src="/gallery-play-bg.svg" />
                  <div className="absolute top-[20px] left-[20px] w-[50px] h-[50px]">
                    <img alt="" className="w-full h-full" src="/gallery-play-icon.svg" />
                    <div className="absolute" style={{ inset: '18.48% 18.34% 18.48% 33.33%' }}>
                      <img alt="" className="w-full h-full" src="/gallery-play-arrow.svg" />
                    </div>
                  </div>
                </div>
                <p className="text-[#333333] text-[24px] leading-[32px] tracking-[-0.48px] whitespace-pre font-normal">
                  {t('aboutPage.gallery.learnMore')}
                </p>
              </button>
            </div>

            {/* Charvak */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <img alt="" className="w-full h-full object-cover" src="/gallery-charvak.webp" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
              <div
                className="absolute bottom-[76px] left-[50px] flex flex-col gap-[10px] text-white font-medium max-w-[546px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <p className="text-[50px] leading-[60px] tracking-[-1.5px] whitespace-pre-wrap">
                  {t('aboutPage.gallery.charvak.title')}
                </p>
                <p className="text-[16px] leading-[28px] tracking-[-0.48px] whitespace-pre">
                  {t('aboutPage.gallery.charvak.description')}
                </p>
              </div>
            </div>

            {/* Heart Container */}
            <div className="relative bg-[#8f7b49]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] overflow-hidden">
                <div className="absolute" style={{ inset: '19.23% 16.06% 19.24% 16.06%' }}>
                  <img alt="" className="w-full h-full" src="/about-icon-heart.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewAboutPage;
