import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [fromLocation, setFromLocation] = useState('tashkent');
  const [toLocation, setToLocation] = useState('');
  const [tourType, setTourType] = useState('individual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams({
      from: fromLocation,
      to: toLocation,
      type: tourType,
      startDate,
      endDate,
      adults: adults.toString(),
      children: children.toString()
    });
    navigate(`/tours?${params.toString()}`);
  };

  const getParticipantsText = () => {
    const parts = [];
    if (adults > 0) {
      parts.push(`${adults} ${translate({ ru: 'взр.', uz: 'katta', en: 'adult', de: 'erw.' })}`);
    }
    if (children > 0) {
      parts.push(`${children} ${translate({ ru: 'реб.', uz: 'bola', en: 'child', de: 'kind' })}`);
    }
    return parts.join(' — ') || translate({ ru: 'Выберите', uz: 'Tanlang', en: 'Select', de: 'Wählen' });
  };

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
           {translate({ 
             ru: 'ДАЛЬВЕРЗИН - лесоохотничье хозяйство', 
             uz: 'DALVARZIN - o\'rmon va ov xo\'jaligi', 
             en: 'DALVERZIN - Forest and Hunting Reserve', 
             de: 'DALVERZIN - Forst- und Jagdwirtschaft' 
           })}
          </h1>
        </div>

        <div className="max-w-[min(1400px,100%)] w-full">
          <div className="rounded-[20px] shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-[clamp(12px,1.11vw,16px)]">
            {/* От куда (From) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
                {translate({ ru: 'Откуда', uz: 'Qayerdan', en: 'From', de: 'Von' })}
              </label>
              <select
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="tashkent">{translate({ ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent', de: 'Taschkent' })}</option>
                <option value="samarkand">{translate({ ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand', de: 'Samarkand' })}</option>
                <option value="bukhara">{translate({ ru: 'Бухара', uz: 'Buxoro', en: 'Bukhara', de: 'Buchara' })}</option>
                <option value="khiva">{translate({ ru: 'Хива', uz: 'Xiva', en: 'Khiva', de: 'Chiwa' })}</option>
              </select>
            </div>

            {/* Куда (To) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
                {translate({ ru: 'Куда', uz: 'Qayerga', en: 'To', de: 'Nach' })}
              </label>
              <select
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="">{translate({ ru: 'Выберите', uz: 'Tanlang', en: 'Select', de: 'Wählen' })}</option>
                <option value="tashkent">{translate({ ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent', de: 'Taschkent' })}</option>
                <option value="samarkand">{translate({ ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand', de: 'Samarkand' })}</option>
                <option value="bukhara">{translate({ ru: 'Бухара', uz: 'Buxoro', en: 'Bukhara', de: 'Buchara' })}</option>
                <option value="khiva">{translate({ ru: 'Хива', uz: 'Xiva', en: 'Khiva', de: 'Chiwa' })}</option>
              </select>
            </div>

            {/* Тип тура (Tour Type) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
                {translate({ ru: 'Тип тура', uz: 'Tur turi', en: 'Tour Type', de: 'Tourtyp' })}
              </label>
              <select
                value={tourType}
                onChange={(e) => setTourType(e.target.value)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
              >
                <option value="individual">{translate({ ru: 'Индивидуальный', uz: 'Individual', en: 'Individual', de: 'Individuell' })}</option>
                <option value="group">{translate({ ru: 'Групповой', uz: 'Guruh', en: 'Group', de: 'Gruppe' })}</option>
                <option value="family">{translate({ ru: 'Семейный', uz: 'Oilaviy', en: 'Family', de: 'Familie' })}</option>
              </select>
            </div>

            {/* Дата (Date Range) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
                {translate({ ru: 'Дата', uz: 'Sana', en: 'Date', de: 'Datum' })}
              </label>
              <div className="flex gap-1 items-center overflow-hidden">
                <div className="flex-1 min-w-0 relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white text-gray-900 text-[clamp(11px,0.9vw,13px)] font-semibold outline-none border-none focus:outline-none appearance-none cursor-pointer"
                    style={{ 
                      colorScheme: 'light',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  />
                </div>
                <span className="text-gray-400 text-[14px] font-bold flex-shrink-0 px-1">—</span>
                <div className="flex-1 min-w-0 relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full bg-white text-gray-900 text-[clamp(11px,0.9vw,13px)] font-semibold outline-none border-none focus:outline-none appearance-none cursor-pointer"
                    style={{ 
                      colorScheme: 'light',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Участники (Participants) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] relative">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
                {translate({ ru: 'Участники', uz: 'Ishtirokchilar', en: 'Participants', de: 'Teilnehmer' })}
              </label>
              <button
                onClick={() => setShowParticipantsDropdown(!showParticipantsDropdown)}
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-semibold outline-none text-left cursor-pointer"
              >
                {getParticipantsText()}
              </button>
              
              {showParticipantsDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-5 z-[10000] border border-gray-200 min-w-[280px] w-max">
                  {/* Adults */}
                  <div className="flex items-center justify-between mb-4 gap-4">
                    <span className="text-[15px] font-medium text-gray-800 whitespace-nowrap">
                      {translate({ ru: 'Взрослые', uz: 'Kattalar', en: 'Adults', de: 'Erwachsene' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdults(Math.max(1, adults - 1));
                        }}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-[17px] font-semibold w-10 text-center">{adults}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdults(Math.min(20, adults + 1));
                        }}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Children */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[15px] font-medium text-gray-800 whitespace-nowrap">
                      {translate({ ru: 'Дети', uz: 'Bolalar', en: 'Children', de: 'Kinder' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChildren(Math.max(0, children - 1));
                        }}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                      >
                        −
                      </button>
                      <span className="text-[17px] font-semibold w-10 text-center">{children}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setChildren(Math.min(10, children + 1));
                        }}
                        className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium px-[clamp(20px,2.22vw,32px)] py-[clamp(12px,1.11vw,16px)] rounded-xl text-[clamp(13px,1.04vw,15px)] transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {translate({ ru: 'Найти туры', uz: 'Turlarni topish', en: 'Find Tours', de: 'Touren finden' })}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HeroSection;