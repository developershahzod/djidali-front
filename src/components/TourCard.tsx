import React, { useState, useEffect } from 'react';
import { Star, Heart, Users, Calendar, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import TourDetailModal from './TourDetailModal';
import { Tour } from '../services/api';
import { toggleWishlistItem, isInWishlist } from '../utils/wishlist';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { t } = useLanguage();
  const [isLiked, setIsLiked] = useState(() =>
    isInWishlist(tour.id.toString())
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setIsLiked(isInWishlist(tour.id.toString()));
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () =>
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [tour.id]);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = toggleWishlistItem(tour.id.toString());
    setIsLiked(newLikedState);
  };

  // Get primary image or first image
  const primaryImage = (() => {
    if (tour.image) return tour.image;

    if (Array.isArray(tour.images) && tour.images.length > 0) {
      const firstImg = tour.images[0];

      // Check if it's an object with image_url
      if (typeof firstImg === 'object' && firstImg !== null) {
        const imgObj = firstImg as any;
        if (imgObj.is_primary && imgObj.image_url) return imgObj.image_url;
        if (imgObj.image_url) return imgObj.image_url;
      }

      // Check if it's a string
      if (typeof firstImg === 'string' && firstImg.trim() !== '') {
        return firstImg;
      }

      // Find first image with is_primary
      const primaryImg = tour.images.find(
        (img: any) =>
          typeof img === 'object' &&
          img !== null &&
          img.is_primary &&
          img.image_url
      );
      if (primaryImg && typeof primaryImg === 'object') {
        return (primaryImg as any).image_url;
      }
    }

    return 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg';
  })();

  const handleCardClick = () => {
    console.log('Card clicked, opening modal');
    setShowModal(true);
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-2xl cursor-pointer overflow-hidden group transition-all duration-300 transform hover:-translate-y-1"
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          <img
            src={primaryImage}
            alt={tour.title}
            className={`w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg">
            {tour.category?.name || tour.badge || 'Tur'}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleToggleLike}
            className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transform hover:scale-110 transition-all duration-200"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Rating and Location */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm font-semibold text-gray-900">
                  {tour.rating || 4.5}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                ({tour.reviews_count || tour.reviewCount || 0})
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 bg-emerald-50 px-2 py-1 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                {tour.location}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 text-lg leading-tight hover:text-emerald-600 transition-colors">
            {tour.title}
          </h3>

          {/* Tour Details */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center space-y-1 bg-gray-50 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">
                {tour.duration} {t('tour.days')}
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1 bg-gray-50 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">
                {tour.dates?.[0]?.start_date
                  ? new Date(tour.dates[0].start_date).toLocaleDateString(
                      'uz-UZ',
                      {
                        month: 'short',
                        day: 'numeric',
                      }
                    )
                  : 'Nov 15'}
              </span>
            </div>
            {(tour.current_participants !== undefined ||
              tour.participants !== undefined) && (
              <div className="flex flex-col items-center space-y-1 bg-gray-50 p-2 rounded-lg">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-gray-700">
                  {tour.current_participants || tour.participants || 4}{' '}
                  {t('tour.people')}
                </span>
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-emerald-600">
                  {(
                    (typeof tour.price === 'object' && tour.price) ||
                    (typeof tour.price === 'number' ? tour.price : 0)
                  ).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">
                  UZS
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {t('tour.from')} {tour.duration} {t('tour.days')}
              </span>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transform hover:scale-105 transition-all duration-200 shadow-md">
              Ko'rish
            </button>
          </div>
        </div>
      </div>

      {/* Tour Detail Modal */}
      <TourDetailModal
        tour={tour}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default TourCard;
