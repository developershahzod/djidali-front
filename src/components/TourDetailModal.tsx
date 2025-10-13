import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, Star, Users, Calendar, MapPin, Plus, Minus, Play, Clock, Award, Shield } from 'lucide-react';
import { ApiTour } from '../services/djidaliApi';
import { Tour } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import TourRegistrationForm from './TourRegistrationForm';
import { toggleWishlistItem, isInWishlist } from '../utils/wishlist';

interface TourDetailModalProps {
  tour: ApiTour | Tour | any;
  isOpen: boolean;
  onClose: () => void;
}

const TourDetailModal: React.FC<TourDetailModalProps> = ({ tour, isOpen, onClose }) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('1 – 5 Noyabr 2025');
  const [participants, setParticipants] = useState(1);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLiked, setIsLiked] = useState(() => isInWishlist(tour.id.toString()));
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setIsLiked(isInWishlist(tour.id.toString()));
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [tour.id]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleToggleLike = () => {
    const newLikedState = toggleWishlistItem(tour.id.toString());
    setIsLiked(newLikedState);
  };
  
  if (!isOpen) return null;

  const tourImages = Array.isArray(tour.images)
    ? tour.images
        .filter(img => {
          if (!img) return false;
          if (typeof img === 'string') return img.trim() !== '';
          if (typeof img === 'object' && (img as any).image_url) return true;
          return false;
        })
        .map(img => {
          if (typeof img === 'object' && (img as any).image_url) return (img as any).image_url;
          return img as string;
        })
    : [];
  const images = tourImages.length > 0 ? tourImages : [];

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 overflow-y-auto ${
        isClosing ? 'bg-opacity-0' : 'bg-opacity-50'
      }`}>
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
          <div className={`bg-white w-full sm:w-[95%] max-w-7xl max-h-[95vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 ${
            isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between z-10 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex-1 min-w-0">
                <nav className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 truncate">
                  Bosh sahifa • Barcha turlar • {tour.title}
                </nav>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {tour.title}
                </h1>
                <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-3">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{tour.destination || tour.location || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleLike}
                  className="p-3 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110"
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </button>
                <button className="p-3 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-3 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row">
              {/* Left Column - Images and Details */}
              <div className="flex-1 p-4 sm:p-8">
                {/* Image Gallery */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="col-span-4 md:col-span-2 relative group">
                      <img
                        src={images[0]}
                        alt="Main tour image"
                        className="w-full h-80 object-cover rounded-2xl hover:scale-105 transition-transform duration-500 cursor-pointer shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      {images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-emerald-600 text-white backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          +{images.length - 1} rasm
                        </div>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className="col-span-4 md:col-span-2 grid grid-cols-2 gap-4">
                        {images.slice(1, 5).map((img, idx) => (
                          <div key={idx} className="relative group overflow-hidden rounded-xl shadow-md">
                            <img
                              src={img}
                              alt={`Tour image ${idx + 2}`}
                              className="w-full h-36 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="col-span-4 relative">
                      <div className="w-full h-80 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-8">
                        <div className="text-center">
                          <MapPin className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                          <p className="text-emerald-800 font-medium">Rasm mavjud emas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tour Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-emerald-200 transform hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{tour.duration} kun</h3>
                    <p className="text-sm text-gray-600 font-medium">Davomiylik</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-blue-200 transform hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{tour.maxParticipants || 12} kishi</h3>
                    <p className="text-sm text-gray-600 font-medium">Max ishtirokchilar</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-amber-200 transform hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Professional</h3>
                    <p className="text-sm text-gray-600 font-medium">Gid xizmati</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tur haqida</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>
                </div>

                {/* What's Included */}
                {tour.inclusions && tour.inclusions.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tur tarkibida</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tour.inclusions.map((inclusion, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}

                {/* Organizer */}
              </div>

              {/* Right Column - Booking */}
              <div className="xl:w-96 bg-gray-50 p-4 sm:p-8">
                <div className="bg-white rounded-2xl p-6 sticky top-6 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {((typeof tour.price === 'object' && tour.price?.amount) || (typeof tour.price === 'number' ? tour.price : 0)).toLocaleString()} UZS
                    </div>
                    <div className="text-gray-600">
                      {Math.round(((typeof tour.price === 'object' && tour.price?.amount) || (typeof tour.price === 'number' ? tour.price : 0)) / tour.duration).toLocaleString()} UZS / kun • {tour.duration} kun
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sana tanlang
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option>{selectedDate}</option>
                      <option>15 – 19 Noyabr 2025</option>
                      <option>1 – 5 Dekabr 2025</option>
                    </select>
                  </div>

                  {/* Participants */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ishtirokchilar
                    </label>
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
                      <button
                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={participants <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-lg">{participants} kishi</span>
                      <button
                        onClick={() => setParticipants(participants + 1)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 text-center">
                      Qolgan joylar: 14 ta
                    </div>
                  </div>

                  {/* Guarantees */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Kafolatlangan tur</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Tezkor bron qilish</span>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tur narxi:</span>
                      <span className="font-medium">{((typeof tour.price === 'object' && tour.price?.amount) || (typeof tour.price === 'number' ? tour.price : 0)).toLocaleString()} UZS</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Ishtirokchilar:</span>
                      <span className="font-medium">{participants} kishi</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                      <span className="text-lg font-bold">Jami:</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {(((typeof tour.price === 'object' && tour.price?.amount) || (typeof tour.price === 'number' ? tour.price : 0)) * participants).toLocaleString()} UZS
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button 
                    onClick={() => setShowRegistration(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mb-4 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300"
                  >
                    Ro'yxatdan o'tish
                  </button>

                  <div className="text-center text-sm text-gray-600 mb-6">
                    Oldindan to'lov — {Math.round(((typeof tour.price === 'object' && tour.price?.amount) || (typeof tour.price === 'number' ? tour.price : 0)) * 0.15).toLocaleString()} UZS<br />
                    To'liq to'lov 24 soat ichida
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <TourRegistrationForm
        tour={tour}
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </>
  );
};

export default TourDetailModal;