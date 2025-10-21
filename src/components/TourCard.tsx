import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tour } from '../services/api';
import { getTourPrimaryImage } from '../utils/imageUtils';

interface TourCardProps {
  tour: Tour;
  onSelect?: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onSelect }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryImage = getTourPrimaryImage(tour);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      navigate(`/tour/${tour.id}`);
    }
  };

  return (
    <div
      className="bg-[#F4F2ED] rounded-[1rem] border border-gray-400 overflow-hidden group transition-all duration-300 cursor-pointer hover:bg-white hover:border-gray-500"
      onClick={handleCardClick}
    >
      <div className="flex items-stretch h-[280px]">
        <div className="flex-1 p-10 flex flex-col justify-between">
          <div>
            <h3 className="font-normal text-gray-900 mb-4 text-[1.75rem] leading-tight">
              {tour.title}
            </h3>

            <p className="text-base text-gray-500 mb-8 line-clamp-1 font-light">
              {tour.location}
            </p>
          </div>

          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div className="items-baseline gap-2 mb-0">
              
              <span className="text-[2rem] font-normal text-gray-900">
                {
                  (
                    (typeof tour.price === 'object' && tour.price) ||
                    (typeof tour.price === 'number' ? tour.price : 350000)
                  ).toLocaleString()}
              </span>
              <span className="text-base text-gray-500 font-light">
                UZS
              </span>
               <div className="text-sm text-gray-400 font-light mb-6">
              От
            </div>
              
            </div>
           

            <div style={{marginLeft: 30, marginTop: 10,
            }}>
              <div className="text-base text-gray-900 font-normal mb-1">
              {tour.duration} дней, до {tour.max_participants || 15} человек
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-light">План включает в себя</span>
            </div>
            </div>
          </div>
        </div>

        <div className="relative w-[35%] overflow-hidden p-5">
          {!imageLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          <img
            src={primaryImage}
            alt={tour.title}
            style={{borderRadius: '1.5rem'}}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          <div className="absolute bottom-10 right-10 px-5 py-2 rounded-full text-sm font-light bg-white/95 backdrop-blur-sm text-gray-900">
            {tour.category?.name || tour.badge || 'Экотуризм'}
          </div>

          <button className="absolute top-1/2 left-0 -translate-y-1/2 w-14 h-14 bg-white/95 bg-white rounded-full flex items-center justify-center transition-all opacity-0 opacity-100 shadow-xl backdrop-blur-sm">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
