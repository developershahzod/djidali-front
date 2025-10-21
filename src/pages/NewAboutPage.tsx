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
      <header className="relative min-h-screen h-[clamp(700px,62.5vw,900px)] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img alt="" className="w-full h-full object-cover" src="/about-hero.webp" />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full">
          <div className="absolute bottom-[clamp(100px,11.11vw,160px)] left-1/2 -translate-x-1/2 w-full max-w-[min(1440px,90vw)] px-[clamp(30px,3.47vw,50px)]">
            <div className="flex items-end justify-between gap-8">
              {/* Title */}
              <div className="flex-1 max-w-[69.3%]">
                <h1
                  className="text-[clamp(48px,6.25vw,90px)] font-medium leading-[1.11] text-white tracking-[-0.03em]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {t('aboutPage.hero.title')}
                </h1>
              </div>

              {/* Stats Card */}
              <div className="flex flex-col gap-[clamp(24px,2.78vw,40px)] w-[clamp(200px,21.67vw,312px)]">
                <div className="relative w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)]">
                  <img alt="" className="w-full h-full" src="/about-icon-airplane-bg.svg" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%]">
                    <img alt="" className="w-full h-full" src="/about-icon-airplane.svg" />
                  </div>
                </div>
                <div className="flex flex-col gap-[4px] text-white">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span className="text-[clamp(36px,3.47vw,50px)]">10</span>
                    <span className="text-[clamp(36px,3.47vw,50px)]"> </span>
                    <span className="font-extralight text-[clamp(28px,2.78vw,40px)]">{t('aboutPage.hero.statsThousand')}</span>
                  </p>
                  <p
                    className="font-light text-[clamp(16px,1.39vw,20px)] leading-[1.4] tracking-[-0.02em] whitespace-nowrap"
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
        <div className="flex max-w-[100vw]">
          {/* Left Content */}
          <div className="flex-1 py-[clamp(50px,5.56vw,80px)] px-[clamp(30px,3.47vw,50px)] max-w-[min(720px,50vw)]">
            <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)] mb-[clamp(30px,2.78vw,40px)] text-[#333333]">
              <h2
                className="text-[clamp(40px,4.17vw,60px)] font-medium leading-[1] tracking-[-0.03em]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('aboutPage.help.title')}
              </h2>
              <p
                className="text-[clamp(20px,2.22vw,32px)] font-normal leading-[1.25] tracking-[-0.03em]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('aboutPage.help.description')}
              </p>
            </div>
            <button
              onClick={() => navigate('/tours')}
              className="bg-[#8f7b49] hover:bg-[#7a6939] transition-colors rounded-[10px] px-[clamp(40px,3.89vw,56px)] py-[clamp(20px,2.08vw,30px)] h-[clamp(60px,5.56vw,80px)] flex items-center justify-center cursor-pointer"
            >
              <p
                className="text-white text-[clamp(16px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] whitespace-pre"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {t('aboutPage.help.cta')}
              </p>
            </button>

            {/* Mission and Guide Sections */}
            <div className="mt-[clamp(60px,7.22vw,104px)] flex gap-[clamp(40px,5.56vw,80px)]">
              {/* Mission Section */}
              <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)] flex-1">
                <div className="w-[clamp(70px,6.25vw,90px)] h-[clamp(70px,6.25vw,90px)]">
                  <img src="/about-icon-stewardess.svg" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col gap-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                  <p
                    className="text-[#0f2825] text-[clamp(18px,1.67vw,24px)] font-medium leading-[1.25]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.mission.title')}
                  </p>
                  <p
                    className="text-[#333333] text-[clamp(14px,1.11vw,16px)] font-normal leading-[1.75]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.mission.description')}
                  </p>
                </div>
              </div>

              {/* Guide Section */}
              <div className="flex flex-col gap-[clamp(16px,1.39vw,20px)] flex-1">
                <div className="w-[clamp(70px,6.25vw,90px)] h-[clamp(70px,6.25vw,90px)]">
                  <img src="/about-icon-map.svg" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col gap-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                  <p
                    className="text-[#0f2825] text-[clamp(18px,1.67vw,24px)] font-medium leading-[1.25]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.guide.title')}
                  </p>
                  <p
                    className="text-[#333333] text-[clamp(14px,1.11vw,16px)] font-normal leading-[1.75]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.guide.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 min-h-[clamp(600px,62.5vw,900px)]">
            <img alt="" className="w-full h-full object-cover" src="/about-help-image.webp" />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-[#f4f2ed] py-[clamp(30px,3.47vw,50px)]">
        <div className="max-w-[min(1440px,90vw)] mx-auto px-[clamp(30px,3.47vw,50px)]">
          <div className="relative aspect-[2.06/1] rounded-[clamp(12px,1.39vw,20px)] overflow-hidden">
            <img alt="" className="w-full h-full object-cover" src="/professionals-video-bg.webp" />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="bg-[#b4a785]">
        <div className="flex max-w-[100vw]">
          {/* Left Image */}
          <div className="flex-1 min-h-[clamp(450px,45.14vw,650px)]">
            <img alt="" className="w-full h-full object-cover" src="/about-professionals-image.webp" />
          </div>

          {/* Right Content */}
          <div className="flex-1 py-[clamp(30px,3.47vw,50px)] px-[clamp(20px,1.81vw,26px)] relative">
              <div className="flex flex-col gap-[clamp(30px,2.78vw,40px)] max-w-[89.4%]">
                <div
                  className="flex flex-col gap-[clamp(16px,1.39vw,20px)] text-white font-medium"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <h2 className="text-[clamp(40px,4.17vw,60px)] leading-[1] tracking-[-0.03em] whitespace-pre">
                    {t('aboutPage.professionals.title')}
                  </h2>
                  <p className="text-[clamp(14px,1.11vw,16px)] leading-[1.75] tracking-[-0.03em] max-w-[51.5%]">
                    <span>{t('aboutPage.professionals.description')} </span>
                    <span className="font-bold">{t('aboutPage.professionals.discount')}</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate('/tours')}
                  className="bg-[#333333] hover:bg-[#1a1a1a] transition-colors rounded-[10px] px-[clamp(40px,3.89vw,56px)] py-[clamp(20px,2.08vw,30px)] h-[clamp(60px,5.56vw,80px)] flex items-center justify-center cursor-pointer"
                >
                  <p
                    className="text-white text-[clamp(16px,1.39vw,20px)] font-bold leading-[1] tracking-[-0.02em] whitespace-pre"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.professionals.cta')}
                  </p>
                </button>
              </div>

              <div className="mt-[clamp(50px,5.83vw,84px)] flex flex-col gap-[clamp(30px,2.78vw,40px)] max-w-[62.8%]">
                <div className="flex gap-[clamp(20px,1.88vw,27px)]">
                  <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white flex-1">
                    <p
                      className="font-normal leading-[1] tracking-[-1px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span className="text-[clamp(36px,3.47vw,50px)]">10 </span>
                      <span className="font-extralight text-[clamp(28px,2.78vw,40px)]">+</span>
                    </p>
                    <p
                      className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] tracking-[-0.02em]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t('aboutPage.professionals.statsYears')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white flex-1">
                    <p
                      className="font-normal leading-[1] tracking-[-1px]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span className="text-[clamp(36px,3.47vw,50px)]">64 </span>
                      <span className="text-[clamp(28px,2.78vw,40px)]">+</span>
                    </p>
                    <p
                      className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] tracking-[-0.02em]"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t('aboutPage.professionals.statsPackages')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white">
                  <p
                    className="font-normal leading-[1] tracking-[-1px]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span className="text-[clamp(36px,3.47vw,50px)]">180 </span>
                    <span className="font-extralight text-[clamp(28px,2.78vw,40px)]">{t('aboutPage.hero.statsThousand')}</span>
                  </p>
                  <p
                    className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] tracking-[-0.02em]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {t('aboutPage.professionals.statsTravelers')}
                  </p>
                </div>
              </div>

              {/* Earth Icon */}
              <div className="absolute bottom-0 right-0 w-[clamp(200px,19.44vw,280px)] h-[clamp(200px,19.44vw,280px)] flex items-center justify-center">
                <div className="rotate-180 scale-y-[-100%]">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute left-[-100%] w-[200%] h-[200%] top-0">
                      <div className="absolute" style={{ inset: '10% 2.3% 10% 6.67%' }}>
                        <img alt="" className="w-full h-full" src="/about-icon-earth.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#f4f2ed] py-[clamp(60px,6.25vw,90px)]">
        <div className="max-w-[min(1440px,90vw)] mx-auto px-[clamp(30px,3.47vw,50px)] mb-[clamp(60px,6.94vw,100px)]">
          <h2
            className="text-[clamp(40px,4.17vw,60px)] font-medium leading-[1] text-[#333333] tracking-[-0.03em]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('aboutPage.team.title')}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-0 w-full">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col">
              <div className="w-full aspect-[480/540]">
                <img alt={member.name} className="w-full h-full object-cover" src={member.image} />
              </div>
              <div className="bg-white border-2 border-[silver] px-[clamp(30px,3.47vw,50px)] py-[clamp(20px,1.94vw,28px)]">
                <div className="flex flex-col gap-[clamp(8px,0.83vw,12px)] text-[#333333]">
                  <p
                    className="text-[clamp(16px,1.53vw,22px)] font-semibold leading-[1.09] tracking-[-0.02em] whitespace-pre"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="text-[clamp(14px,1.11vw,16px)] font-medium leading-[1] tracking-[-0.02em]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-[#f4f2ed] pb-[clamp(60px,6.94vw,100px)]">
        <div className="flex items-end justify-between px-[clamp(30px,3.47vw,50px)] mb-[clamp(60px,6.94vw,100px)] max-w-[min(1440px,90vw)] mx-auto">
          <h2
            className="text-[clamp(40px,4.17vw,60px)] font-medium leading-[1] text-[#333333] tracking-[-0.03em] whitespace-pre"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('aboutPage.gallery.title')}
          </h2>
          <p
            className="text-[clamp(16px,1.39vw,20px)] font-light leading-[1.4] text-[#333333] text-right tracking-[-0.02em] whitespace-pre"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <span className="font-bold">14</span>
            <span> {t('aboutPage.gallery.available')}</span>
          </p>
        </div>

        <div className="grid grid-cols-[48.96%_51.04%] grid-rows-[clamp(300px,31.25vw,450px)_clamp(300px,31.25vw,450px)_clamp(450px,48.61vw,700px)] gap-0 w-full">
            {/* Dalverzin - LEFT COLUMN, spans rows 1-2 */}
            <div className="relative row-span-2 overflow-hidden">
              <div className="absolute inset-0">
                <img alt="" className="w-full h-full object-cover" src="/gallery-dalverzin.webp" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
              <div
                className="absolute bottom-[clamp(40px,5.28vw,76px)] left-[clamp(30px,3.47vw,50px)] flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white font-medium max-w-[85.8%]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <p className="text-[clamp(32px,3.47vw,50px)] leading-[1.2] tracking-[-0.03em]">
                  {t('aboutPage.gallery.dalverzin.title')}
                </p>
                <p className="text-[clamp(14px,1.11vw,16px)] leading-[1.75] tracking-[-0.03em]">
                  {t('aboutPage.gallery.dalverzin.description')}
                </p>
              </div>
            </div>

            {/* Kyzylkum - RIGHT COLUMN, row 1 */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <img alt="" className="w-full h-full object-cover" src="/gallery-kyzylkum.webp" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
              <div
                className="absolute bottom-[clamp(40px,5.28vw,76px)] left-[clamp(30px,3.47vw,50px)] flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white font-medium max-w-[86.4%]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <p className="text-[clamp(32px,3.47vw,50px)] leading-[1.2] tracking-[-0.03em]">
                  {t('aboutPage.gallery.kyzylkum.title')}
                </p>
                <p className="text-[clamp(14px,1.11vw,16px)] leading-[1.75] tracking-[-0.03em] whitespace-pre">
                  {t('aboutPage.gallery.kyzylkum.description')}
                </p>
              </div>
            </div>

            {/* Heart Container - LEFT COLUMN, row 3 */}
            <div className="relative bg-[#8f7b49]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(180px,17.36vw,250px)] h-[clamp(180px,17.36vw,250px)] overflow-hidden">
                <div className="absolute" style={{ inset: '19.23% 16.06% 19.24% 16.06%' }}>
                  <img alt="" className="w-full h-full" src="/about-icon-heart.svg" />
                </div>
              </div>
            </div>

            {/* Video Section - RIGHT COLUMN, row 2 */}
            <div className="relative bg-[#cbc2ab]">
              <button
                onClick={() => navigate('/tours')}
                className="absolute bottom-[clamp(30px,2.78vw,40px)] left-[clamp(30px,3.47vw,50px)] flex items-center gap-[clamp(20px,2.08vw,30px)] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="relative w-[clamp(70px,6.25vw,90px)] h-[clamp(70px,6.25vw,90px)]">
                  <img alt="" className="w-full h-full" src="/gallery-play-bg.svg" />
                  <div className="absolute top-[22.2%] left-[22.2%] w-[55.6%] h-[55.6%]">
                    <img alt="" className="w-full h-full" src="/gallery-play-icon.svg" />
                    <div className="absolute" style={{ inset: '18.48% 18.34% 18.48% 33.33%' }}>
                      <img alt="" className="w-full h-full" src="/gallery-play-arrow.svg" />
                    </div>
                  </div>
                </div>
                <p className="text-[#333333] text-[clamp(18px,1.67vw,24px)] leading-[1.33] tracking-[-0.02em] whitespace-pre font-normal">
                  {t('aboutPage.gallery.learnMore')}
                </p>
              </button>
            </div>

            {/* Charvak - RIGHT COLUMN, row 3 */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                <img alt="" className="w-full h-full object-cover" src="/gallery-charvak.webp" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
              <div
                className="absolute bottom-[clamp(40px,5.28vw,76px)] left-[clamp(30px,3.47vw,50px)] flex flex-col gap-[clamp(8px,0.69vw,10px)] text-white font-medium max-w-[74.3%]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <p className="text-[clamp(32px,3.47vw,50px)] leading-[1.2] tracking-[-0.03em] whitespace-pre-wrap">
                  {t('aboutPage.gallery.charvak.title')}
                </p>
                <p className="text-[clamp(14px,1.11vw,16px)] leading-[1.75] tracking-[-0.03em] whitespace-pre">
                  {t('aboutPage.gallery.charvak.description')}
                </p>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
};

export default NewAboutPage;
