import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Trash2, Share2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import PageSkeleton from '../components/PageSkeleton';
import TourCard from '../components/TourCard';
import { useTours } from '../hooks/useTours';
import { getWishlistItems, removeFromWishlist, clearWishlist } from '../utils/wishlist';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('added');
  const [loading, setLoading] = useState(true);

  const { tours: allTours } = useTours({ per_page: 100, autoFetch: true });

  const wishlistItems = allTours.filter(tour => wishlistIds.includes(tour.id.toString()));

  useEffect(() => {
    const loadWishlist = () => {
      const items = getWishlistItems();
      setWishlistIds(items);
      setLoading(false);
    };

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  const handleRemoveFromWishlist = (tourId: string) => {
    removeFromWishlist(tourId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear all items from wishlist?')) {
      clearWishlist();
    }
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return a.duration - b.duration;
      default:
        return 0; // Keep original order for 'added'
    }
  });

  if (loading) {
    return <PageSkeleton showHeader={true} showGrid={true} gridCols={3} />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('page.backButton')}</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{t('wishlist.title')}</h1>
                  <p className="text-gray-600 mt-1">{wishlistItems.length} {t('wishlist.saved')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleClearWishlist}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('wishlist.clearAll')}</span>
                </button>
              )}
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
                <span>{t('wishlist.share')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length > 0 ? (
          <>
            {/* Filters and Sort */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t('wishlist.sortBy')}</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  >
                    <option value="added">{t('wishlist.addedTime')}</option>
                    <option value="price">{t('wishlist.byPrice')}</option>
                    <option value="rating">{t('wishlist.byRating')}</option>
                    <option value="duration">{t('wishlist.byDuration')}</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {t('wishlist.showing')} {wishlistItems.length} {t('wishlist.of')} {wishlistItems.length}
              </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedItems.map((tour) => (
                <div key={tour.id} className="relative group">
                  <TourCard tour={tour} />
                  <button
                    onClick={() => handleRemoveFromWishlist(tour.id.toString())}
                    className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('wishlist.youMightLike')}</h2>
                <p className="text-gray-600">{t('wishlist.recommendedDesc')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {allTours.slice(0, 3).map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('wishlist.empty')}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('wishlist.emptyDesc')}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 font-semibold"
              >
                {t('wishlist.viewTours')}
              </button>
              <div className="text-sm text-gray-500">
                {t('wishlist.tip')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;