import React from 'react';

interface PageSkeletonProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  showGrid?: boolean;
  gridCols?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ 
  showHeader = true, 
  showSidebar = false, 
  showGrid = true,
  gridCols = 3 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-64 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Skeleton */}
        {showSidebar && (
          <div className="w-80 bg-white border-r border-gray-200 p-6">
            <div className="space-y-6">
              {/* Filter Header */}
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-16 h-5 bg-gray-200 rounded"></div>
              </div>

              {/* Filter Sections */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="w-full h-10 bg-gray-100 rounded-lg"></div>
                    <div className="w-full h-3 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Content Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          {showGrid && (
            <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-${gridCols}`}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Image */}
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  
                  {/* Content */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="space-y-1">
                        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;