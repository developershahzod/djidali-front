import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTourPrimaryImage } from '../utils/imageUtils';
import { useTour } from '../hooks/useTours';
import { useLanguage } from '../contexts/LanguageContext';
import TourRegistrationForm from '../components/TourRegistrationForm';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { tour, loading, error } = useTour(id ?? null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [tourType, setTourType] = useState('Экотуризм');

  const tourTypes = [
    'Экотуризм',
    'Агротуризм',
    'Тимбилдинг',
    'Спортивная стрельба',
    'Охотничий туризм',
    'Туры по Узбекистану'
  ];
  
  const primaryImage = useMemo(() => (tour ? getTourPrimaryImage(tour) : ''), [tour]);

  const galleryImages = useMemo(() => {
    if (!tour) return [];
    const images =
      tour.images?.map((image) => {
        if (typeof image === 'string') return image;
        if (image && typeof image === 'object') {
          if ('image_url' in image && (image as { image_url?: string }).image_url) {
            return (image as { image_url: string }).image_url;
          }
          if ('url' in image && (image as { url?: string }).url) {
            return (image as { url: string }).url;
          }
        }
        return '';
      }).filter(Boolean) ?? [];
    if (!images.length && primaryImage) return [primaryImage];
    return images;
  }, [tour, primaryImage]);

  const itineraryItems = useMemo<ItineraryItem[]>(() => {
    if (!tour) return [];
    if (tour.itinerary && tour.itinerary.length > 0) {
      return [...tour.itinerary]
        .map((item) => ({
          day: item.day,
          title: item.title,
          description: item.description
        }))
        .sort((a, b) => a.day - b.day);
    }
    return [];
  }, [tour]);

  useEffect(() => {
    if (itineraryItems.length > 0 && activeDay === null) {
      setActiveDay(itineraryItems[0].day);
    }
  }, [itineraryItems, activeDay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8f7b49]"></div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center px-6">
        <div className="max-w-xl text-center space-y-6">
          <h2 className="text-[2rem] font-light text-[#333333]">Не удалось загрузить тур</h2>
          <p className="text-base text-[#666]">{error || 'Попробуйте обновить страницу'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ed] text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden h-[900px]">
        <div className="absolute inset-0">
          {primaryImage && <img src={primaryImage} alt={tour.title} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Title */}
        <h1 className="absolute top-[240px] left-[50px] text-white font-medium max-w-[1340px] text-[90px] leading-[100px]" style={{ letterSpacing: '-2.7px' }}>
          {tour.title}
        </h1>

        {/* Location */}
        <a href="#location" className="absolute top-[816px] left-[1053px] text-white underline text-[20px]" style={{ letterSpacing: '-0.4px' }}>
          {tour.location || 'Локация'}
        </a>

        {/* Stats */}
        <div className="absolute top-[632px] left-[50px] flex gap-[30px]">
          {/* Price */}
          <div className="flex flex-col gap-[40px] w-[426px]">
            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 2V38M26 10H17C15.6739 10 14.4021 10.5268 13.4645 11.4645C12.5268 12.4021 12 13.6739 12 15C12 16.3261 12.5268 17.5979 13.4645 18.5355C14.4021 19.4732 15.6739 20 17 20H23C24.3261 20 25.5979 20.5268 26.5355 21.4645C27.4732 22.4021 28 23.6739 28 25C28 26.3261 27.4732 27.5979 26.5355 28.5355C25.5979 29.4732 24.3261 30 23 30H12" stroke="#333333" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex flex-col gap-[10px] text-white">
              <div className="text-[50px] font-medium leading-[50px]" style={{ letterSpacing: '-1px' }}>
                {Number((tour.price ?? 0)).toLocaleString('ru-RU')}{' '}
                <span className="text-[40px] font-extralight">UZS</span>
              </div>
              <div className="text-[20px] font-light leading-[28px]" style={{ letterSpacing: '-0.4px' }}>
                Стоимость программы
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-[40px] w-[426px]">
            <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#333333" strokeWidth="2"/>
                <path d="M20 10V20L26 26" stroke="#333333" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex flex-col gap-[10px] text-white">
              <div className="text-[50px] font-medium leading-[50px]" style={{ letterSpacing: '-1px' }}>
                {tour.duration ?? 0}{' '}
                <span className="text-[40px] font-extralight">дней</span>
              </div>
              <div className="text-[20px] font-light leading-[28px]" style={{ letterSpacing: '-0.4px' }}>
                Продолжительность тура
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Container Section */}
      <section className="relative bg-white" style={{ height: '394px' }}>
        {/* Tour Details */}
        <div className="absolute top-[80px] left-[50px] right-[50px] flex justify-between items-center max-w-full">
          <div className="flex flex-col gap-[10px] w-[234px]">
            <div className="text-[20px] leading-[24px]" style={{ letterSpacing: '-0.4px' }}>Людей</div>
            <div className="text-[32px] font-medium leading-[40px]" style={{ letterSpacing: '-0.64px' }}>
              макс. {tour.max_participants ?? 10}
            </div>
          </div>
          <div className="w-[62px] h-[1px] bg-gray-300 rotate-90" />
          <div className="flex flex-col gap-[10px] w-[234px]">
            <div className="text-[20px] leading-[24px]" style={{ letterSpacing: '-0.4px' }}>Минимальный возраст</div>
            <div className="text-[32px] font-medium leading-[40px]" style={{ letterSpacing: '-0.64px' }}>от 12 лет</div>
          </div>
          <div className="w-[62px] h-[1px] bg-gray-300 rotate-90" />
          <div className="flex flex-col gap-[10px] flex-1">
            <div className="text-[20px] leading-[24px]" style={{ letterSpacing: '-0.4px' }}>Тип тура</div>
            <select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              className="text-[20px] font-medium leading-[28px] bg-transparent border-none outline-none cursor-pointer"
              style={{ letterSpacing: '-0.4px', fontFamily: 'Montserrat, sans-serif' }}
            >
              {tourTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="w-[62px] h-[1px] bg-gray-300 rotate-90" />
          <div className="flex flex-col gap-[10px] w-[234px]">
            <div className="text-[20px] leading-[24px]" style={{ letterSpacing: '-0.4px' }}>Сложность</div>
            <div className="text-[32px] font-medium leading-[40px]" style={{ letterSpacing: '-0.64px' }}>Легкое</div>
          </div>
        </div>

        {/* Booking Button */}
        <div className="absolute top-[234px] left-[50px] right-[50px] flex justify-center">
          <button 
            onClick={() => setShowRegistration(true)}
            className="w-[300px] h-[80px] bg-[#8f7b49] text-white rounded-[10px] text-[20px] font-bold hover:bg-[#7a6839] transition-all hover:scale-105 shadow-lg" 
            style={{ letterSpacing: '-0.4px', lineHeight: '20px', fontFamily: 'Montserrat, sans-serif' }}
          >
            Забронировать<br />сейчас
          </button>
        </div>
      </section>

      {/* Registration Modal */}
      <TourRegistrationForm 
        tour={tour as any} 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
      />

      {/* About Section */}
      <section className="px-[50px] py-[80px] max-w-[1440px] mx-auto">
        <h2 className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]" style={{ letterSpacing: '-1.8px' }}>
          О туре
        </h2>
        <div className="text-[35px] text-black leading-[60px] mb-[40px]" style={{ letterSpacing: '-0.7px' }}>
          <p>{tour.description || 'Этот тур создан для тех, кто хочет почувствовать атмосферу настоящей дикой природы'}</p>
        </div>

        <div className="flex gap-[31px]">
          <div className="w-[426px]">
            <h3 className="text-[32px] font-medium text-[#333333] leading-[40px] mb-[20px]" style={{ letterSpacing: '-0.64px' }}>
              Что включено
            </h3>
            {(tour.included || ['Проживание (эко-домики)', 'Трёхразовое питание', 'Услуги гида', 'Трансфер из Ташкента', 'Экскурсии по заповеднику']).map((item, i) => (
              <div key={i} className="text-[20px] text-[#333333] leading-[24px] mb-[16px] pl-[30px] relative" style={{ letterSpacing: '-0.4px' }}>
                <span className="absolute left-[10px]">•</span>
                {item}
              </div>
            ))}
          </div>
          <div className="w-[426px]">
            <h3 className="text-[32px] font-medium text-[#333333] leading-[40px] mb-[20px]" style={{ letterSpacing: '-0.64px' }}>
              Что не входит в тур
            </h3>
            {(tour.excluded || ['Личные расходы', 'Алкогольные напитки', 'Медицинская страховка', 'Охотничье снаряжение (по запросу)']).map((item, i) => (
              <div key={i} className="text-[20px] text-[#333333] leading-[24px] mb-[16px] pl-[30px] relative" style={{ letterSpacing: '-0.4px' }}>
                <span className="absolute left-[10px]">•</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-[50px] py-[80px] max-w-[1440px] mx-auto">
        <h2 className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]" style={{ letterSpacing: '-1.8px' }}>
          Моменты из тура
        </h2>
        {galleryImages.length > 0 ? (
          <div className="flex flex-col gap-0">
            {/* Top Image */}
            <div className="w-full h-[500px] rounded-t-[20px] overflow-hidden">
              <img 
                src={galleryImages[0]} 
                alt={`${tour.title} - Момент 1`} 
                className="w-full h-full object-cover" 
              />
            </div>
            {/* Bottom Images */}
            <div className="flex gap-0">
              {galleryImages.slice(1, 3).length > 0 ? (
                galleryImages.slice(1, 3).map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-1/2 h-[586px] overflow-hidden ${index === 0 ? 'rounded-bl-[20px]' : 'rounded-br-[20px]'}`}
                  >
                    <img 
                      src={image} 
                      alt={`${tour.title} - Момент ${index + 2}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))
              ) : (
                // If only 1 image, duplicate it for layout
                <>
                  <div className="w-1/2 h-[586px] overflow-hidden rounded-bl-[20px]">
                    <img 
                      src={galleryImages[0]} 
                      alt={`${tour.title} - Момент 2`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="w-1/2 h-[586px] overflow-hidden rounded-br-[20px]">
                    <img 
                      src={galleryImages[0]} 
                      alt={`${tour.title} - Момент 3`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-[20px]">Изображения загружаются...</p>
          </div>
        )}
      </section>

      {/* Program Section */}
      <section className="px-[50px] py-[80px] max-w-[1440px] mx-auto">
        <h2 className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]" style={{ letterSpacing: '-1.8px' }}>
          Программа тура
        </h2>
        <div className="flex flex-col gap-[20px]">
          {itineraryItems.map((item) => {
            const isOpen = activeDay === item.day;
            return (
              <div
                key={item.day}
                className="border-2 border-silver rounded-[20px] px-[40px] py-[38px] cursor-pointer hover:border-[#8f7b49] transition-colors"
                onClick={() => setActiveDay(isOpen ? null : item.day)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-[30px] items-center flex-1">
                    <div className="text-[35px] font-medium text-black w-[273px]" style={{ letterSpacing: '-0.7px' }}>
                      День {item.day}
                    </div>
                    <div className="text-[20px] text-black flex-1" style={{ letterSpacing: '-0.4px' }}>
                      {item.title.replace(/^День\s*\d+\s*/i, '').trim() || item.title}
                    </div>
                  </div>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M19.9992 21.9531L28.2492 13.7031L30.6059 16.0598L19.9992 26.6665L9.39258 16.0598L11.7492 13.7031L19.9992 21.9531Z" fill="#151412" />
                  </svg>
                </div>
                {isOpen && (
                  <div className="mt-4 text-[20px] text-black pl-[303px]" style={{ letterSpacing: '-0.4px' }}>
                    {item.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="px-[50px] py-[80px] max-w-[1440px] mx-auto">
        <h2 className="text-[60px] font-medium text-[#333333] leading-[60px] mb-[40px]" style={{ letterSpacing: '-1.8px' }}>
          Локация
        </h2>
        <div className="relative w-full h-[500px] rounded-[20px] overflow-hidden border border-white">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(tour.location || 'Ташкент, Узбекистан')}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tour Location Map"
          />
        </div>
      </section>
    </div>
  );
};

export default TourDetailPage;
