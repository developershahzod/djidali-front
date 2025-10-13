import React, { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('multiDay');

  const handleSearch = () => {
    if (onSearch && selectedLocation.trim()) {
      onSearch(selectedLocation.trim());
    }
  };

  const getPlaceholderText = () => {
    switch (t('hero.searchPlaceholder')) {
      case 'hero.searchPlaceholder':
        return 'Qayerga bormoqchisiz?';
      default:
        return t('hero.searchPlaceholder');
    }
  };

  return (
    <div
      className="relative h-[450px] md:h-[580px] bg-cover bg-center"
      style={{
        backgroundImage: `url('https://api.djidali.uz/storage/01K06W5XJBXDHA262G2CD33V9R.jpg')`
      }}
    >
      {/* Modern gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="text-center mb-8 md:mb-14">
          <h1 className="hidden md:block text-4xl md:text-5xl font-extrabold mb-5 leading-tight text-white drop-shadow-lg">
            {t('hero.title')}
            <br />
            <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">{t('hero.subtitle')}</span>
          </h1>
          <h1 className="md:hidden text-3xl font-extrabold mb-4 leading-tight text-white drop-shadow-lg">
            <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">{t('hero.mobileTitle')}</span>
          </h1>
          <p className="hidden md:block text-lg text-gray-100 max-w-2xl mx-auto font-medium drop-shadow-md">
            {t('hero.description')}
          </p>
        </div>

        {/* Tour Type Tabs */}
        <div className="flex justify-center mb-10 md:mb-12">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-1.5 flex shadow-2xl border border-white/30">
            <button
              className={`px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'multiDay'
                  ? 'bg-white text-emerald-600 shadow-lg scale-105'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('multiDay')}
            >
              {t('hero.multiDay')}
            </button>
            <button
              className={`px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'singleDay'
                  ? 'bg-white text-emerald-600 shadow-lg scale-105'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('singleDay')}
            >
              {t('hero.singleDay')}
            </button>
            <button
              className={`px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'unusual'
                  ? 'bg-white text-emerald-600 shadow-lg scale-105'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
              onClick={() => setActiveTab('unusual')}
            >
              <span className="mr-2">🦌</span>
              {t('hero.unusual')}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-5 flex flex-col md:flex-row gap-3 border border-white/30">
            {/* Location Input */}
            <div className="flex-1 relative group">
              <div className="flex items-center px-5 py-4 md:border-r border-white/30 rounded-xl transition-all group-hover:bg-white/10">
                <Search className="w-5 h-5 text-white mr-3 transition-transform group-hover:scale-110" />
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="flex-1 outline-none text-white placeholder-white/70 text-base font-medium bg-transparent"
                  placeholder={getPlaceholderText()}
                />
                {selectedLocation && (
                  <button onClick={() => setSelectedLocation('')} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X className="w-4 h-4 text-white hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Date Input */}
            <div className="flex-1 relative group">
              <div className="flex items-center px-5 py-4 rounded-xl transition-all group-hover:bg-white/10">
                <Calendar className="w-5 h-5 text-white mr-3 transition-transform group-hover:scale-110" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 outline-none text-white placeholder-white/70 text-base font-medium bg-transparent"
                  placeholder={t('hero.datePlaceholder')}
                />
                {selectedDate && (
                  <button onClick={() => setSelectedDate('')} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X className="w-4 h-4 text-white hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-white text-emerald-600 hover:bg-white/90 font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl text-base transition-all duration-300 transform hover:scale-105"
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