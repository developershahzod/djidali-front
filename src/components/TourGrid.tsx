import React, { useState } from 'react';
import TourCard from './TourCard';
import TourCardSkeleton from './TourCardSkeleton';
import TourDetailModal from './TourDetailModal';
import { Tour } from '../services/api';

interface TourGridProps {
  tours: Tour[];
  loading: boolean;
  error: string | null;
  onShowMore?: () => void;
  showMoreVisible?: boolean;
}

const TourGrid: React.FC<TourGridProps> = ({ tours, loading, error, onShowMore, showMoreVisible = false }) => {
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const sortedTours = tours;

  const handleCardSelect = (tour: Tour) => {
    setSelectedTour(tour);
  };

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
    <div className="flex-1">
      {/* Tour Grid */}
      {loading ? (
        <div className="space-y-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <TourCardSkeleton key={index} />
          ))}
        </div>
      ) : (
      <div className="space-y-8">
        {sortedTours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour as any}
            onSelect={() => handleCardSelect(tour)}
          />
        ))}
      </div>
      )}

      {sortedTours.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">
            Турлар топилмади
          </div>
          <div className="text-gray-400 text-sm">
            Бошқа филтрларни синаб кўринг
          </div>
        </div>
      )}

      {showMoreVisible && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onShowMore}
            disabled={loading}
            className={`px-16 py-4 border border-gray-300 rounded-xl text-gray-700 transition-all font-light text-base ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:shadow-xl'
            }`}
          >
            Показать больше
          </button>
        </div>
      )}

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