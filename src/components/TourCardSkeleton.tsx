import React from 'react';

const TourCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="w-full h-56 bg-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-7">
        {/* Category Tag */}
        <div className="mb-3">
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Rating and Location */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Title */}
        <div className="mb-5 space-y-2">
          <div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Tour Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TourCardSkeleton;