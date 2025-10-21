import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, Users, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { ApiTour } from '../services/djidaliApi';
import { Tour } from '../services/api';
import { toggleWishlistItem, isInWishlist } from '../utils/wishlist';

interface NewTourDetailModalProps {
  tour: ApiTour | Tour | any;
  isOpen: boolean;
  onClose: () => void;
}

const NewTourDetailModal: React.FC<NewTourDetailModalProps> = ({ tour, isOpen, onClose }) => {
  const [isLiked, setIsLiked] = useState(() => isInWishlist(tour.id.toString()));
  const [isClosing, setIsClosing] = useState(false);
  const [openDay, setOpenDay] = useState<number | null>(null);

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
  const images = tourImages.length > 0 ? tourImages : ['https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg'];

  const days = [
    { day: 1, title: 'День 1', description: 'Встреча в Ташкенте, трансфер в Чаткаль, заселение, ужин' },
    { day: 2, title: 'День 2', description: 'Экскурсия по заповеднику, наблюдение за животными и птицами' },
    { day: 3, title: 'День 3', description: 'Пеший поход наверху к водопаду и ночевка на природе' },
    { day: 4, title: 'День 4', description: 'Отдых, фотосессия, дегустация национальной кухни' },
    { day: 5, title: 'День 5', description: 'Отдых, фотосессия, дегустация национальной кухни' },
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 overflow-y-auto ${
      isClosing ? 'bg-opacity-0' : 'bg-opacity-50'
    }`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`bg-white w-full max-w-[1400px] max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
          <div
            className="relative h-[320px] bg-cover bg-center"
            style={{ backgroundImage: `url(${images[0]})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>

            <button
              onClick={handleClose}
              className="absolute top-8 right-8 w-14 h-14 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-xl"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>

            <div className="absolute bottom-10 left-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2">
                  <Calendar className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-light text-gray-900">{tour.duration || 5} дней</span>
                </div>
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2">
                  <Users className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-light text-gray-900">макс. 10</span>
                </div>
              </div>
              <h1 className="text-[3rem] leading-[1.1] font-light text-white mb-2">
                {tour.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-[2.5rem] font-normal text-white">
                  {Number(tour.price || 1440000).toLocaleString()}
                </span>
                <span className="text-xl text-white/90 font-light">UZS</span>
              </div>
              <p className="text-white/80 text-sm font-light mt-1">Стоимость тура • {tour.duration || 5} дней</p>
            </div>
          </div>

          <div className="p-10">
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div>
                <p className="text-gray-500 text-sm font-light mb-2">Возраст</p>
                <p className="text-gray-900 text-lg font-normal">от 12 лет</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-light mb-2">Минимальный возраст</p>
                <p className="text-gray-900 text-lg font-normal">от 12 лет</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-light mb-2">Тип тура</p>
                <p className="text-gray-900 text-lg font-normal">Легкое</p>
              </div>
            </div>

            <div className="bg-[#F5F5F0] rounded-2xl p-10 mb-12">
              <div className="grid md:grid-cols-2 gap-16 mb-8">
                <div className="flex items-center gap-8">
                  <input
                    type="text"
                    placeholder="Введите ваше имя"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-8">
                  <input
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#8B7355] focus:outline-none">
                    <option>12-20 сен</option>
                  </select>
                </div>
                <div>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#8B7355] focus:outline-none">
                    <option>2 взр. — 3 реб.</option>
                  </select>
                </div>
                <div>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#8B7355] focus:outline-none">
                    <option>Легкое</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium px-8 py-4 rounded-xl transition-all text-base">
                Забронировать сейчас
              </button>
              <p className="text-gray-500 text-sm font-light mt-4 text-center">
                План бронирования доступен на все даты
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-20 mb-12">
              <div>
                <h2 className="text-[32px] font-normal text-gray-900 mb-6">О туре</h2>
                <p className="text-gray-700 leading-[1.7] text-[17px] mb-6">
                  Этот тур создан для тех, кто хочет почувствовать атмосферу настоящей дикой природы.
                </p>
                <p className="text-gray-700 leading-[1.7] text-[17px]">
                  Вы посетите живописные горные долины, пройдёте по тропам Чаткальского заповедника и познакомитесь с флорой и фауной региона.
                  Проживание запланировано в уютных эко-домиках, питание — по включённому плану.
                </p>
              </div>

              <div>
                <h2 className="text-[32px] font-normal text-gray-900 mb-6">Что включено</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-[15px]">Проживание (три реномированных)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-[15px]">Трёхразовое питание</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-[15px]">Услуги гида</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-[15px]">Трансфер от Ташкента</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-[15px]">Экскурсии по маршруту</span>
                  </div>
                </div>

                <h3 className="text-[24px] font-normal text-gray-900 mt-8 mb-4">Что не входит в тур</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600 text-[15px]">Личные расходы</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600 text-[15px]">Алкогольные напитки</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600 text-[15px]">Медицинская страховка</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                    <span className="text-gray-600 text-[15px]">Сувенирные покупки (не включён)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-[32px] font-normal text-gray-900 mb-6">Моменты из тура</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {images.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={`Tour moment ${idx + 1}`}
                      className="w-full h-[240px] object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-[32px] font-normal text-gray-900 mb-6">План по дням</h2>
              <div className="space-y-3">
                {days.map((dayInfo) => (
                  <div key={dayInfo.day} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(openDay === dayInfo.day ? null : dayInfo.day)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[18px] font-normal text-gray-900">{dayInfo.title}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          openDay === dayInfo.day ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDay === dayInfo.day && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-700 text-[15px] leading-[1.7]">{dayInfo.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-[32px] font-normal text-gray-900 mb-6">Локация</h2>
              <div className="bg-gray-50 rounded-2xl h-[450px] flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-lg">Карта маршрута</p>
                  <p className="text-sm text-gray-500 mt-2">Чаткальский заповедник, Узбекистан</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTourDetailModal;
