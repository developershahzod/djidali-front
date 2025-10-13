import React, { useState } from 'react';
import { Grid2x2 as Grid, List, ChevronDown } from 'lucide-react';
import TourCard from './TourCard';
import TourCardSkeleton from './TourCardSkeleton';
import LoadingSpinner from './LoadingSpinner';
import TourDetailModal from './TourDetailModal';
import { useLanguage } from '../contexts/LanguageContext';
import { Tour } from '../services/api';

interface TourGridProps {
  tours: Tour[];
  loading: boolean;
  error: string | null;
}

const TourGrid: React.FC<TourGridProps> = ({ tours, loading, error }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [sortBy, setSortBy] = useState('popularity');

  const sortedTours = [...tours].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        const priceA = (typeof a.price === 'object' && a.price?.amount) || (typeof a.price === 'number' ? a.price : 0);
        const priceB = (typeof b.price === 'object' && b.price?.amount) || (typeof b.price === 'number' ? b.price : 0);
        return priceA - priceB;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'duration':
        return a.duration - b.duration;
      default:
        return (b.rating || 0) - (a.rating || 0); // popularity by rating
    }
  });

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">Ma'lumotlarni yuklashda xatolik</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 bg-gray-50 rounded-xl lg:rounded-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h2 className="text-lg font-medium text-gray-900">
            {sortedTours.length} {t('filters.found')}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{t('filters.sort')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="popularity">{t('filters.popularity')}</option>
              <option value="price">{t('filters.price')}</option>
              <option value="rating">{t('filters.rating')}</option>
              <option value="duration">{t('filters.duration')}</option>
            </select>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tour Grid */}
      {loading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TourCardSkeleton key={index} />
          ))}
        </div>
      ) : (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {sortedTours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour as any} // Type conversion for compatibility
          />
        ))}
      </div>
      )}

      {sortedTours.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">
            {loading ? 'Ma\'lumotlar yuklanmoqda...' : 'Turlar topilmadi'}
          </div>
          <div className="text-gray-400 text-sm">
            {!loading && 'Boshqa filtrlarni sinab ko\'ring'}
          </div>
        </div>
      )}

      {/* Monthly Tours Section */}
     

      {/* Tour Detail Modal */}
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          isOpen={!!selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}
    </div>
  );
};

export default TourGrid;