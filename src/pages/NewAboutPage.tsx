import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const NewAboutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const teamMembers = [
    { name: t('aboutPage.team.member1.name'), role: t('aboutPage.team.member1.role'), image: '/about-team-1.png' },
    { name: t('aboutPage.team.member2.name'), role: t('aboutPage.team.member2.role'), image: '/about-team-2.png' },
    { name: t('aboutPage.team.member3.name'), role: t('aboutPage.team.member3.role'), image: '/about-team-3.png' },
    { name: t('aboutPage.team.member4.name'), role: t('aboutPage.team.member4.role'), image: '/about-team-4.png' },
    { name: t('aboutPage.team.member5.name'), role: t('aboutPage.team.member5.role'), image: '/about-team-5.png' },
    { name: t('aboutPage.team.member6.name'), role: t('aboutPage.team.member6.role'), image: '/about-team-6.png' },
  ];

  return (
    <div className="bg-[#f4f2ed] relative size-full">
      {/* Hero Section */}
      <div className="absolute h-[900px] left-0 overflow-clip right-0 top-0">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src="/about-hero.png" />
          <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
        </div>

        {/* Hero Content */}
        <div className="absolute font-['Montserrat',_sans-serif] font-medium leading-[100px] left-[50px] text-[90px] text-white top-[640px] tracking-[-2.7px] w-[998px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <p className="mb-0 leading-[100px]">{t('aboutPage.hero.title')}</p>
        </div>

        {/* Stats Card */}
        <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[1078px] top-[632px] w-[312px]">
          <div className="relative shrink-0 size-[80px]">
            <div className="absolute left-0 size-[80px] top-0">
              <img alt="" className="block max-w-none size-full" src="/about-icon-airplane-bg.svg" />
            </div>
            <div className="absolute left-1/2 size-[40px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
              <img alt="" className="block max-w-none size-full" src="/about-icon-airplane.svg" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start leading-[0] relative shrink-0 text-[0px] text-white w-full">
            <p className="font-['Montserrat',_sans-serif] font-normal leading-[1] relative shrink-0 tracking-[-1px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-[50px]">10</span>
              <span className="text-[50px]"> </span>
              <span className="font-['Montserrat',_sans-serif] font-extralight text-[40px]">{t('aboutPage.hero.statsThousand')}</span>
            </p>
            <p className="font-['Montserrat',_sans-serif] font-light leading-[28px] relative shrink-0 text-[20px] tracking-[-0.4px] w-full whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span>{t('aboutPage.hero.statsClients').split(' ').slice(0, -1).join(' ')} </span>
              <span className="font-semibold">{t('aboutPage.hero.statsClients').split(' ').slice(-1)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="absolute bg-white h-[900px] left-0 right-0 top-[900px]">
        <div className="absolute h-[900px] right-0 top-0 w-[720px]">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="/about-help-image.png" />
        </div>

        <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[50px] top-[80px] w-[636px]">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 text-[#333333] w-full">
            <p className="font-['Montserrat',_sans-serif] font-medium leading-[60px] relative shrink-0 text-[60px] tracking-[-1.8px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('aboutPage.help.title')}
            </p>
            <p className="font-['Montserrat',_sans-serif] font-normal leading-[40px] relative shrink-0 text-[32px] tracking-[-0.96px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('aboutPage.help.description')}
            </p>
          </div>
          <button
            onClick={() => navigate('/tours')}
            className="bg-[#8f7b49] box-border content-stretch flex gap-[10px] h-[80px] items-center justify-center px-[56px] py-[30px] relative rounded-[10px] shrink-0 cursor-pointer hover:bg-[#7a6939] transition-colors"
          >
            <p className="font-['Montserrat',_sans-serif] font-bold leading-[20px] relative shrink-0 text-[20px] text-nowrap text-white tracking-[-0.4px] whitespace-pre" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('aboutPage.help.cta')}
            </p>
          </button>
        </div>

        {/* Mission Icons */}
        <div className="absolute left-[50px] size-[90px] top-[564px]">
          <img src="/about-icon-stewardess.svg" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="absolute left-[393px] size-[90px] top-[564px]">
          <img src="/about-icon-map.svg" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[50px] top-[674px] tracking-[-0.48px] w-[313px]">
          <p className="font-['Montserrat',_sans-serif] font-medium leading-[30px] relative shrink-0 text-[#0f2825] text-[24px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('aboutPage.mission.title')}
          </p>
          <p className="font-['Montserrat',_sans-serif] font-normal leading-[28px] relative shrink-0 text-[#333333] text-[16px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('aboutPage.mission.description')}
          </p>
        </div>

        <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[393px] top-[674px] tracking-[-0.48px] w-[312px]">
          <p className="font-['Montserrat',_sans-serif] font-medium leading-[30px] relative shrink-0 text-[#0f2825] text-[24px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('aboutPage.guide.title')}
          </p>
          <p className="font-['Montserrat',_sans-serif] font-normal leading-[28px] relative shrink-0 text-[#333333] text-[16px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('aboutPage.guide.description')}
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="absolute h-[700px] left-[50px] top-[1850px] w-[1340px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[20px] size-full" src="/professionals-video-bg.png" />
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[20px]" />
        </div>
      </div>

      {/* Professionals Section */}
      <div className="absolute bg-[#b4a785] h-[650px] left-0 top-[2660px] w-[1440px]">
        <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[746px] top-[384px] w-[452px]">
          <div className="content-stretch flex items-start relative shrink-0">
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 text-white w-[225px]">
              <p className="font-['Montserrat',_sans-serif] font-normal leading-[1] relative shrink-0 text-[0px] tracking-[-1px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="text-[50px]">10 </span>
                <span className="font-['Montserrat',_sans-serif] font-extralight text-[40px]">+</span>
              </p>
              <p className="font-['Montserrat',_sans-serif] font-light leading-[28px] relative shrink-0 text-[20px] tracking-[-0.4px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('aboutPage.professionals.statsYears')}
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 text-white">
              <p className="font-['Montserrat',_sans-serif] font-normal leading-[1] relative shrink-0 text-[0px] tracking-[-1px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="text-[50px]">64 </span>
                <span className="text-[40px]">+</span>
              </p>
              <p className="font-['Montserrat',_sans-serif] font-light leading-[28px] relative shrink-0 text-[20px] tracking-[-0.4px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {t('aboutPage.professionals.statsPackages')}
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 text-white w-[304px]">
            <p className="font-['Montserrat',_sans-serif] font-normal leading-[1] relative shrink-0 text-[0px] tracking-[-1px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-[50px]">180 </span>
              <span className="font-['Montserrat',_sans-serif] font-extralight text-[40px]">{t('aboutPage.hero.statsThousand')}</span>
            </p>
            <p className="font-['Montserrat',_sans-serif] font-light leading-[28px] relative shrink-0 text-[20px] tracking-[-0.4px] w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('aboutPage.professionals.statsTravelers')}
            </p>
          </div>
        </div>

        <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[746px] top-[50px] w-[644px]">
          <div className="content-stretch flex flex-col font-['Montserrat',_sans-serif] font-medium gap-[20px] items-start relative shrink-0 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <p className="leading-[60px] relative shrink-0 text-[60px] text-nowrap tracking-[-1.8px] whitespace-pre">
              {t('aboutPage.professionals.title')}
            </p>
            <p className="leading-[28px] relative shrink-0 text-[16px] tracking-[-0.48px] w-[332px]">
              <span>{t('aboutPage.professionals.description')} </span>
              <span className="font-['Montserrat',_sans-serif] font-bold">{t('aboutPage.professionals.discount')}</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/tours')}
            className="bg-[#333333] box-border content-stretch flex gap-[10px] h-[80px] items-center justify-center px-[56px] py-[30px] relative rounded-[10px] shrink-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          >
            <p className="font-['Montserrat',_sans-serif] font-bold leading-[20px] relative shrink-0 text-[20px] text-nowrap text-white tracking-[-0.4px] whitespace-pre" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t('aboutPage.professionals.cta')}
            </p>
          </button>
        </div>

        <div className="absolute h-[650px] right-[720px] top-0 w-[720px]">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src="/about-professionals-image.png" />
        </div>

        {/* Earth Icon */}
        <div className="absolute bottom-0 flex items-center justify-center right-0 size-[280px]">
          <div className="flex-none rotate-[180deg] scale-y-[-100%]">
            <div className="overflow-clip relative size-[280px]">
              <div className="absolute left-[-280px] size-[560px] top-0">
                <div className="absolute inset-[10%_2.3%_10%_6.67%]">
                  <img alt="" className="block max-w-none size-full" src="/about-icon-earth.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="absolute h-[1574px] left-0 top-[3390px] w-[1440px]">
        <p className="absolute font-['Montserrat',_sans-serif] font-medium leading-[60px] left-[50px] text-[#333333] text-[60px] top-0 tracking-[-1.8px] w-[1340px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {t('aboutPage.team.title')}
        </p>

        <div className="absolute content-start flex flex-wrap gap-0 items-start left-0 top-[100px] w-[1440px]">
          {teamMembers.map((member, index) => (
            <div key={index} className="h-[698px] relative shrink-0 w-[480px]">
              <div className="absolute h-[540px] left-0 top-0 w-[480px]">
                <img alt={member.name} className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={member.image} />
              </div>
              <div className="absolute bg-white border-[2px] border-[silver] border-solid left-0 right-0 top-[540px]">
                <div className="content-stretch flex flex-col gap-[12px] items-start px-[50px] pt-[28px] pb-[31px] text-[#333333]">
                  <p className="font-['Montserrat',_sans-serif] font-semibold leading-[24px] relative shrink-0 text-[22px] text-nowrap tracking-[-0.44px] whitespace-pre" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {member.name}
                  </p>
                  <p className="font-['Montserrat',_sans-serif] font-medium leading-[16px] min-w-full relative shrink-0 text-[16px] tracking-[-0.32px] w-[min-content]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="absolute h-[1800px] left-0 top-[5004px] w-[1440px]">
        <div className="absolute content-stretch flex items-end justify-between left-1/2 text-[#333333] text-nowrap top-0 translate-x-[-50%] w-[1340px] whitespace-pre">
          <p className="font-['Montserrat',_sans-serif] font-medium leading-[60px] relative shrink-0 text-[60px] tracking-[-1.8px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {t('aboutPage.gallery.title')}
          </p>
          <p className="font-['Montserrat',_sans-serif] font-light leading-[28px] relative shrink-0 text-[20px] text-right tracking-[-0.4px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="font-['Montserrat',_sans-serif] font-bold">14</span>
            <span> {t('aboutPage.gallery.available')}</span>
          </p>
        </div>

        <div className="absolute h-[1600px] left-0 top-[100px] w-[1440px]">
          {/* Dalverzin */}
          <div className="absolute h-[900px] left-0 top-0 w-[705px]">
            <div className="absolute h-[900px] left-0 top-0 w-[705px]">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 overflow-hidden">
                  <img alt="" className="absolute h-full left-[-2.01%] max-w-none top-0 w-[170.21%]" src="/gallery-dalverzin.png" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col font-['Montserrat',_sans-serif] font-medium gap-[10px] items-start left-[50px] text-white top-[724px] w-[605px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <p className="leading-[60px] relative shrink-0 text-[50px] tracking-[-1.5px] w-full">
                {t('aboutPage.gallery.dalverzin.title')}
              </p>
              <p className="leading-[28px] relative shrink-0 text-[16px] tracking-[-0.48px] w-full">
                {t('aboutPage.gallery.dalverzin.description')}
              </p>
            </div>
          </div>

          {/* Kyzylkum */}
          <div className="absolute h-[450px] left-[705px] top-0 w-[735px]">
            <div className="absolute h-[450px] left-0 top-0 w-[735px]">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src="/gallery-kyzylkum.png" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col font-['Montserrat',_sans-serif] font-medium gap-[10px] items-start left-[50px] text-white top-[274px] w-[635px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <p className="leading-[60px] min-w-full relative shrink-0 text-[50px] tracking-[-1.5px] w-[min-content]">
                {t('aboutPage.gallery.kyzylkum.title')}
              </p>
              <p className="leading-[28px] relative shrink-0 text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
                {t('aboutPage.gallery.kyzylkum.description')}
              </p>
            </div>
          </div>

          {/* Video Section */}
          <div className="absolute h-[450px] left-[705px] top-[450px] w-[735px]">
            <div className="absolute bg-[#cbc2ab] h-[450px] left-0 top-0 w-[735px]" />
            <button
              onClick={() => navigate('/tours')}
              className="absolute content-stretch flex gap-[30px] items-center left-[50px] top-[310px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[90px]">
                  <img alt="" className="block max-w-none size-full" src="/gallery-play-bg.svg" />
                </div>
                <div className="[grid-area:1_/_1] ml-[20px] mt-[20px] overflow-clip relative size-[50px]">
                  <div className="absolute inset-0">
                    <img alt="" className="block max-w-none size-full" src="/gallery-play-icon.svg" />
                  </div>
                  <div className="absolute inset-[18.48%_18.34%_18.48%_33.33%]">
                    <img alt="" className="block max-w-none size-full" src="/gallery-play-arrow.svg" />
                  </div>
                </div>
              </div>
              <p className="font-['Poppins',_'Noto_Sans',_sans-serif] leading-[32px] relative shrink-0 text-[#333333] text-[24px] text-nowrap tracking-[-0.48px] whitespace-pre">
                {t('aboutPage.gallery.learnMore')}
              </p>
            </button>
          </div>

          {/* Charvak */}
          <div className="absolute h-[700px] left-[705px] top-[900px] w-[735px]">
            <div className="absolute h-[700px] left-0 top-0 w-[735px]">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src="/gallery-charvak.png" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </div>
            </div>
            <div className="absolute content-stretch flex flex-col font-['Montserrat',_sans-serif] font-medium gap-[10px] items-start left-[50px] text-white top-[524px] w-[546px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <p className="leading-[60px] min-w-full relative shrink-0 text-[50px] tracking-[-1.5px] w-[min-content] whitespace-pre-wrap">
                {t('aboutPage.gallery.charvak.title')}
              </p>
              <p className="leading-[28px] relative shrink-0 text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
                {t('aboutPage.gallery.charvak.description')}
              </p>
            </div>
          </div>

          {/* Heart Container */}
          <div className="absolute h-[700px] left-0 top-[900px] w-[705px]">
            <div className="absolute bg-[#8f7b49] h-[700px] left-0 top-0 w-[705px]" />
            <div className="absolute left-[228px] overflow-clip size-[250px] top-[225px]">
              <div className="absolute inset-[19.23%_16.06%_19.24%_16.06%]">
                <img alt="" className="block max-w-none size-full" src="/about-icon-heart.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute left-0 top-[6650px] w-full">
        <Footer />
      </div>
    </div>
  );
};

export default NewAboutPage;
