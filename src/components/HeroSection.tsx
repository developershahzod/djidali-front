import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('Ташкент');
  const [selectedDate, setSelectedDate] = useState('12-20 сен');
  const [selectedParticipants, setSelectedParticipants] = useState('2 взр. — 3 реб.');
  const [selectedTourType, setSelectedTourType] = useState('Экотуризм');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(selectedCountry);
    }
  };

  return (
    <div className="relative h-screen min-h-[800px] overflow-hidden" style={{
 
}}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/m1.png')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16 h-full flex flex-col justify-center pb-0 pt-30">
        <div className="mb-24">
          <h1 className="text-[5.5rem] leading-[1.12] font-light text-white tracking-tight">
            DJIDALI — охота и туризм<br />
            без границ
          </h1>
        </div>

        <div className="max-w-[1400px] w-full">
          <div className="rounded-[20px] shadow-2xl pt-30 grid grid-cols-1 md:grid-cols-5 gap-4">
<div className="flex-1 bg-white bg-white rounded-xl pt-3 pl-3 pb-3 pr-3">
              <label className="block text-[11px] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide color-white">Страна</label>
              <select
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="w-full   bg-white text-gray-900 text-[15px] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="Ташкент">Ташкент</option>
                <option value="Самарканд">Самарканд</option>
                <option value="Бухара">Бухара</option>
                <option value="Хива">Хива</option>
              </select>
            </div>

<div className="flex-1 bg-white bg-white rounded-xl pt-3 pl-3 pb-3 pr-3">
              <label className="block text-[11px] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide color-white">Дата</label>
              <select
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full   bg-white  rounded-xl text-gray-900 text-[15px] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="12-20 сен">12-20 сен</option>
                <option value="21-30 сен">21-30 сен</option>
                <option value="1-10 окт">1-10 окт</option>
              </select>
            </div>

<div className="flex-1 bg-white bg-white rounded-xl pt-3 pl-3 pb-3 pr-3">
              <label className="block text-[11px] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide color-white">Участники</label>
              <select
                value={selectedParticipants}
                onChange={(event) => setSelectedParticipants(event.target.value)}
                className="w-full   bg-white rounded-xl text-gray-900 text-[15px] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="2 взр. — 3 реб.">2 взр. — 3 реб.</option>
                <option value="1 взр.">1 взр.</option>
                <option value="2 взр.">2 взр.</option>
                <option value="Группа">Группа</option>
              </select>
            </div>

<div className="flex-1 bg-white bg-white rounded-xl pt-3 pl-3 pb-3 pr-3">
              <label className="block text-[11px] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide color-white">Тип тура</label>
              <select
                value={selectedTourType}
                onChange={(event) => setSelectedTourType(event.target.value)}
                className="w-full   bg-white rounded-xl text-gray-900 text-[15px] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="Экотуризм">Экотуризм</option>
                <option value="Охота">Охота</option>
                <option value="Агротуризм">Агротуризм</option>
                <option value="Тимбилдинг">Тимбилдинг</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium px-8  rounded-xl text-[15px] transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl flex items-center justify-center mt-0"
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