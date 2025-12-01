import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TourType = 'individual' | 'group' | 'family';

const TourFilter = ({ isHomePage = false }: { isHomePage?: boolean }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [tourType, setTourType] = useState<TourType | ''>('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (from) queryParams.append('from', from);
    if (to) queryParams.append('to', to);
    if (date) queryParams.append('date', date);
    if (tourType) queryParams.append('type', tourType);
    queryParams.append('adults', adults.toString());
    queryParams.append('children', children.toString());
    
    navigate(`/tours?${queryParams.toString()}`);
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${isHomePage ? 'max-w-4xl mx-auto' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">От куда</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Город или регион"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Куда</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Город или регион"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            style={{ colorScheme: 'light' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип тура</label>
          <select
            value={tourType}
            onChange={(e) => setTourType(e.target.value as TourType)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите тип</option>
            <option value="individual">Индивидуальный</option>
            <option value="group">Групповой</option>
            <option value="family">Семейный</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Взрослые</label>
          <div className="flex items-center">
            <button 
              onClick={() => setAdults(prev => Math.max(1, prev - 1))}
              className="p-2 bg-gray-200 rounded-l-md"
            >
              -
            </button>
            <span className="p-2 bg-gray-100 min-w-10 text-center">{adults}</span>
            <button 
              onClick={() => setAdults(prev => prev + 1)}
              className="p-2 bg-gray-200 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дети</label>
          <div className="flex items-center">
            <button 
              onClick={() => setChildren(prev => Math.max(0, prev - 1))}
              className="p-2 bg-gray-200 rounded-l-md"
            >
              -
            </button>
            <span className="p-2 bg-gray-100 min-w-10 text-center">{children}</span>
            <button 
              onClick={() => setChildren(prev => prev + 1)}
              className="p-2 bg-gray-200 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleSearch}
        className="w-full bg-[#8f7b49] text-white py-3 rounded-md hover:bg-[#7a6939] transition-colors"
      >
        {isHomePage ? 'Найти туры' : 'Применить фильтры'}
      </button>
    </div>
  );
};

export default TourFilter;
