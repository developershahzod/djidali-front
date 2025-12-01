import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { TourFilters } from '../pages/TourListPage';

// Label styles matching Figma design
const labelClasses = 'block text-sm text-[#333333] opacity-50 mb-[3px] font-medium tracking-[-0.28px] leading-[20px]';

// Select/value styles matching Figma design
const selectClasses = 'w-full appearance-none bg-transparent text-[22px] font-semibold leading-6 text-[#333333] outline-none tracking-[-0.44px] border-none cursor-pointer';

// Card wrapper matching Figma design - exact 80px height, 20px horizontal padding
const cardWrapper = 'rounded-[10px] bg-white px-5 py-[18px] h-[80px] flex flex-col gap-[3px] items-start justify-center w-full';

const FIGMA_ASSETS = {
  iconBase: '/icons/icon-base.svg',
  iconFilter: '/icons/icon-filter.svg',
  iconSort: '/icons/icon-sort.svg',
  divider: '/icons/divider.svg',
} as const;


interface TourListHeroProps {
  filters: TourFilters;
  onFilterChange: (filters: Partial<TourFilters>) => void;
  onSearch: () => void;
  totalTours?: number;
}

const TourListHero: React.FC<TourListHeroProps> = ({ filters, onFilterChange, onSearch, totalTours = 0 }) => {
  const { translate } = useLanguage();
  const [fromLocation, setFromLocation] = useState(filters.country || 'tashkent');
  const [toLocation, setToLocation] = useState('');
  const [tourType, setTourType] = useState('individual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showParticipantsDropdown, setShowParticipantsDropdown] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc' | 'popular'>('popular');
  const [priceFrom, setPriceFrom] = useState<string>('');
  const [priceTo, setPriceTo] = useState<string>('');
  const [durationFrom, setDurationFrom] = useState<string>('');
  const [durationTo, setDurationTo] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [sortPosition, setSortPosition] = useState({ top: 0, left: 0 });
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

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

  // Initialize dates from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startDateParam = urlParams.get('startDate');
    const endDateParam = urlParams.get('endDate');

    if (startDateParam) {
      setStartDate(startDateParam);
    }
    if (endDateParam) {
      setEndDate(endDateParam);
    }
  }, []);

  // Close modals when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    const handleScroll = () => {
      setIsFilterOpen(false);
      setIsSortOpen(false);
      setShowParticipantsDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // tourTypeOptions not needed anymore - we use hardcoded options in the select

  // participantOptions not needed anymore - we use custom dropdown

  return (
    <section
      className="relative overflow-hidden text-white h-[700px]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="../public/4c9440e694c34a2077b88db951060112fbd0015d.jpg" 
          alt="Tour background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Search Container - positioned below the wave */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 px-[50px]">
          <div className="w-full">
            <div className="flex flex-col gap-[10px] lg:flex-row lg:items-center lg:gap-[10px]">
              {/* Search Form Grid - 6 columns like HeroSection */}
              <div className="grid w-full grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-5">
                {/* Откуда (From) */}
                 <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] col-span-1 sm:col-span-2 lg:col-span-1">
                  <label className={labelClasses}>
                    {translate({ ru: 'Откуда', uz: 'Qayerdan', en: 'From', de: 'Von' })}
                  </label>
                  <select
                    value={fromLocation}
                    onChange={(e) => {onFilterChange({ country: e.target.value }); setFromLocation(e.target.value);}}
                    className={selectClasses}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <option value="tashkent">{translate({ ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent', de: 'Taschkent' })}</option>
                    <option value="samarkand">{translate({ ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand', de: 'Samarkand' })}</option>
                    <option value="bukhara">{translate({ ru: 'Бухара', uz: 'Buxoro', en: 'Bukhara', de: 'Buchara' })}</option>
                    <option value="khiva">{translate({ ru: 'Хива', uz: 'Xiva', en: 'Khiva', de: 'Chiwa' })}</option>
                  </select>
                </div>

                {/* Куда (To) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] col-span-1 sm:col-span-2 lg:col-span-1">
                  <label className={labelClasses}>
                    {translate({ ru: 'Куда', uz: 'Qayerga', en: 'To', de: 'Nach' })}
                  </label>
                  <select
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className={selectClasses}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <option value="">{translate({ ru: 'Выберите', uz: 'Tanlang', en: 'Select', de: 'Wählen' })}</option>
                    <option value="tashkent">{translate({ ru: 'Ташкент', uz: 'Toshkent', en: 'Tashkent', de: 'Taschkent' })}</option>
                    <option value="samarkand">{translate({ ru: 'Самарканд', uz: 'Samarqand', en: 'Samarkand', de: 'Samarkand' })}</option>
                    <option value="bukhara">{translate({ ru: 'Бухара', uz: 'Buxoro', en: 'Bukhara', de: 'Buchara' })}</option>
                    <option value="khiva">{translate({ ru: 'Хива', uz: 'Xiva', en: 'Khiva', de: 'Chiwa' })}</option>
                  </select>
                </div>

                {/* Тип тура (Tour Type) */}
               <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] col-span-1 sm:col-span-2 lg:col-span-1">
                  <label className={labelClasses}>
                    {translate({ ru: 'Тип тура', uz: 'Tur turi', en: 'Tour Type', de: 'Tourtyp' })}
                  </label>
                  <select
                    value={tourType}
                    onChange={(e) => { onFilterChange({ tourType: e.target.value }); setTourType(e.target.value); }}
                    className={selectClasses}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <option value="individual">{translate({ ru: 'Индивидуальный', uz: 'Individual', en: 'Individual', de: 'Individuell' })}</option>
                    <option value="group">{translate({ ru: 'Групповой', uz: 'Guruh', en: 'Group', de: 'Gruppe' })}</option>
                    <option value="family">{translate({ ru: 'Семейный', uz: 'Oilaviy', en: 'Family', de: 'Familie' })}</option>
                  </select>
                </div>

                {/* Дата (Date Range) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] col-span-1 sm:col-span-2 lg:col-span-1">
                  <label className={labelClasses}>
                    {translate({ ru: 'Дата', uz: 'Sana', en: 'Date', de: 'Datum' })}
                  </label>
                  <div className="flex gap-1 items-center overflow-hidden">
                   <div className="flex-1 min-w-0 relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white text-gray-900 text-[clamp(11px,0.9vw,13px)] font-semibold outline-none border-none focus:outline-none appearance-none cursor-pointer"
                        style={{ colorScheme: 'light', WebkitAppearance: 'none', MozAppearance: 'none' }}
                      />
                    </div>
                    <span className="text-gray-400 text-[14px] font-bold flex-shrink-0 px-1">—</span>
                      <div className="flex gap-1 items-center overflow-hidden">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full bg-white text-gray-900 text-[clamp(11px,0.9vw,13px)] font-semibold outline-none border-none focus:outline-none appearance-none cursor-pointer"
                        style={{ colorScheme: 'light', WebkitAppearance: 'none', MozAppearance: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Участники (Participants) */}
              <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)] col-span-1 sm:col-span-2 lg:col-span-1 relative">
                  <label className={labelClasses}>
                    {translate({ ru: 'Участники', uz: 'Ishtirokchilar', en: 'Participants', de: 'Teilnehmer' })}
                  </label>
                  <button
                    onClick={() => setShowParticipantsDropdown(!showParticipantsDropdown)}
                    className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-semibold outline-none text-left cursor-pointer"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
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
                            onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                          >
                            −
                          </button>
                          <span className="text-[17px] font-semibold w-10 text-center text-black">{adults}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setAdults(Math.min(20, adults + 1)); }}
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
                            onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                          >
                            −
                          </button>
                          <span className="text-[17px] font-semibold w-10 text-center text-black">{children}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setChildren(Math.min(10, children + 1)); }}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B7355] hover:text-white flex items-center justify-center text-gray-700 font-bold text-[18px] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Search Button */}
              <button
                onClick={onSearch}
                className="bg-[#8F7B49] hover:bg-[#7A6640] text-white font-bold text-[20px] leading-[20px] tracking-[-0.4px] px-[56px] py-[30px] rounded-[10px] transition-all duration-200 whitespace-nowrap flex items-center justify-center h-[80px] w-full flex-shrink-0 lg:w-[180px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {translate({ ru: 'Поиск', uz: 'Qidiruv', en: 'Search', de: 'Suche' })}
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Sort Section - positioned at bottom */}
        <div className="absolute bottom-[40px] left-0 right-0 px-[50px]">
          <div className="w-full flex items-center gap-[40px] text-white">
          <div className="relative">
            <button
              ref={filterButtonRef}
              onClick={() => {
                if (!isFilterOpen && filterButtonRef.current) {
                  const rect = filterButtonRef.current.getBoundingClientRect();
                  setFilterPosition({ 
                    top: rect.bottom + window.scrollY + 10, 
                    left: rect.left + window.scrollX 
                  });
                  setIsSortOpen(false); // Закрываем сортировку при открытии фильтра
                }
                setIsFilterOpen(!isFilterOpen);
              }}
              className="flex items-center gap-[16px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="overflow-clip relative shrink-0 h-[24px] w-[24px]">
                <img src={FIGMA_ASSETS.iconBase} alt="" className="block h-full w-full max-w-none" />
                <div className="absolute inset-[8.33%]">
                  <img src={FIGMA_ASSETS.iconFilter} alt="" className="block h-full w-full max-w-none" />
                </div>
              </div>
              <span className="text-[20px] font-normal leading-[24px] tracking-[-0.4px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{translate({ ru: 'Фильтр', uz: 'Filtr', en: 'Filter', de: 'Filter' })}</span>
            </button>

            {/* Filter Modal */}
            {isFilterOpen && createPortal(
              <div 
                ref={filterRef}
                className="absolute bg-white rounded-xl shadow-2xl p-6 z-[9999] border border-gray-200 min-w-[320px]"
                style={{ top: `${filterPosition.top}px`, left: `${filterPosition.left}px` }}
              >
                <h3 className="text-[#333333] text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Дополнительные фильтры
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-[#333333] mb-2 font-medium">Цена (UZS)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="От" 
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                      />
                      <input 
                        type="number" 
                        placeholder="До" 
                        value={priceTo}
                        onChange={(e) => setPriceTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#333333] mb-2 font-medium">Длительность (дни)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="От" 
                        value={durationFrom}
                        onChange={(e) => setDurationFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                      />
                      <input 
                        type="number" 
                        placeholder="До" 
                        value={durationTo}
                        onChange={(e) => setDurationTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onFilterChange({ 
                        priceFrom, 
                        priceTo, 
                        durationFrom, 
                        durationTo 
                      });
                      setIsFilterOpen(false);
                      // НЕ вызываем onSearch() - фильтрация применяется на фронте
                    }}
                    className="w-full bg-[#8F7B49] hover:bg-[#7A6640] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Применить
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>

          <div className="flex h-[20px] w-[20px] items-center justify-center opacity-50">
            <img src={FIGMA_ASSETS.divider} alt="" className="h-[1px] w-[20px] rotate-90" />
          </div>

          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={() => {
                if (!isSortOpen && sortButtonRef.current) {
                  const rect = sortButtonRef.current.getBoundingClientRect();
                  setSortPosition({ 
                    top: rect.bottom + window.scrollY + 10, 
                    left: rect.left + window.scrollX 
                  });
                  setIsFilterOpen(false); // Закрываем фильтр при открытии сортировки
                }
                setIsSortOpen(!isSortOpen);
              }}
              className="flex items-center gap-[16px] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="overflow-clip relative shrink-0 h-[24px] w-[24px]">
                <img src={FIGMA_ASSETS.iconBase} alt="" className="block h-full w-full max-w-none" />
                <div className="absolute bottom-[25%] left-[12.5%] right-[12.5%] top-[25%]">
                  <img src={FIGMA_ASSETS.iconSort} alt="" className="block h-full w-full max-w-none" />
                </div>
              </div>
              <span className="text-[20px] font-normal leading-[24px] tracking-[-0.4px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{translate({ ru: 'Сортировать', uz: 'Saralash', en: 'Sort', de: 'Sortieren' })}</span>
            </button>

            {/* Sort Modal */}
            {isSortOpen && createPortal(
              <div 
                ref={sortRef}
                className="absolute bg-white rounded-xl shadow-2xl p-4 z-[9999] border border-gray-200 min-w-[280px]"
                style={{ top: `${sortPosition.top}px`, left: `${sortPosition.left}px` }}
              >
                <div className="flex flex-col gap-2">
                  {[
                    { value: 'popular', label: 'Популярные' },
                    { value: 'price-asc', label: 'Цена: по возрастанию' },
                    { value: 'price-desc', label: 'Цена: по убыванию' },
                    { value: 'duration-asc', label: 'Длительность: короткие' },
                    { value: 'duration-desc', label: 'Длительность: длинные' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const newSortOption = option.value as typeof sortOption;
                        setSortOption(newSortOption);
                        onFilterChange({ sortBy: newSortOption });
                        setIsSortOpen(false);
                        // НЕ вызываем onSearch() - сортировка применяется на фронте
                      }}
                      className={`text-left px-4 py-3 rounded-lg transition-colors ${
                        sortOption === option.value 
                          ? 'bg-[#8F7B49] text-white' 
                          : 'text-[#333333] hover:bg-gray-100'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>,
              document.body
            )}
          </div>
          
          {/* Tours Count - aligned with filters on the right */}
          <div className="ml-auto text-white text-right text-[20px] font-light leading-[28px] tracking-[-0.4px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="font-bold">{totalTours} {translate({ ru: 'доступных', uz: 'mavjud', en: 'available', de: 'verfügbar' })}</span> {translate({ ru: 'туров', uz: 'turlar', en: 'tours', de: 'Touren' })}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default TourListHero;
