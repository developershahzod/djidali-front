import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t, translate } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('tashkent');
  const [selectedTourType, setSelectedTourType] = useState('eco');
  const [selectedDate, setSelectedDate] = useState('sep-12-20');
  const [selectedParticipants, setSelectedParticipants] = useState('family');

  const dateOptions = useMemo(
    () => [
      { value: 'sep-12-20', label: t('hero.rangeSep12To20') },
      { value: 'sep-21-30', label: t('hero.rangeSep21To30') },
      { value: 'oct-1-10', label: t('hero.rangeOct01To10') }
    ],
    [t]
  );

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/m1.webp')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      <div className="relative z-10 max-w-[min(1400px,90vw)] mx-auto px-[clamp(20px,4vw,64px)] h-full flex flex-col justify-center pb-0 pt-30">
        <div className="mb-[clamp(40px,6.67vw,96px)]">
          <h1 className="text-[clamp(32px,5.5vw,88px)] leading-[1.12] font-light text-white tracking-tight">
            DJIDALI — {t('hero.title')}<br />
            {t('hero.subtitle')}
          </h1>
        </div>

        <div className="max-w-[min(1400px,100%)] w-full">
          <div className="rounded-[20px] shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[clamp(12px,1.11vw,16px)]">
<div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">{t('hero.countryLabel')}</label>
              <select
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="tashkent">{translate({ ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent' })}</option>
                <option value="samarkand">{translate({ ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand' })}</option>
                <option value="bukhara">{translate({ ru: 'Бухара', uz: 'Buxoro', en: 'Bukhara' })}</option>
                <option value="khiva">{translate({ ru: 'Хива', uz: 'Xiva', en: 'Khiva' })}</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">{t('hero.dateLabel')}</label>
              <select
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">{t('hero.participantsLabel')}</label>
              <select
                value={selectedParticipants}
                onChange={(event) => setSelectedParticipants(event.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="family">{t('hero.participantsFamily')}</option>
                <option value="solo">{t('hero.participantsSolo')}</option>
                <option value="couple">{t('hero.participantsCouple')}</option>
                <option value="group">{t('hero.participantsGroup')}</option>
              </select>
            </div>

            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">{t('hero.tourTypeLabel')}</label>
              <select
                value={selectedTourType}
                onChange={(event) => setSelectedTourType(event.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="eco">{t('hero.multiDay')}</option>
                <option value="hunting">{t('hero.hunting')}</option>
                <option value="agro">{t('hero.agro')}</option>
                <option value="team">{t('hero.teamBuilding')}</option>
              </select>
            </div>

            <button
              onClick={() => navigate('/tours')}
              className="bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium px-[clamp(20px,2.22vw,32px)] py-[clamp(12px,1.11vw,16px)] rounded-xl text-[clamp(13px,1.04vw,15px)] transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl flex items-center justify-center sm:col-span-2 lg:col-span-1"
            >
              {t('hero.findTours')}
            </button>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default HeroSection;