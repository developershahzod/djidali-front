import React from 'react';
import { Package, Calendar, Heart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatusBarProps {
  ordersCount: number;
  activeToursCount: number;
  savedCount?: number;
  loyaltyLevel?: 'bronze' | 'silver' | 'gold';
}

const StatusBar: React.FC<StatusBarProps> = ({
  ordersCount,
  activeToursCount,
  savedCount = 0,
  loyaltyLevel = 'bronze',
}) => {
  const navigate = useNavigate();

  const getLoyaltyColor = () => {
    switch (loyaltyLevel) {
      case 'gold': return 'text-amber-500';
      case 'silver': return 'text-gray-400';
      default: return 'text-orange-400';
    }
  };

  const stats = [
    {
      icon: Package,
      label: 'Total Bookings',
      value: ordersCount,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Calendar,
      label: 'Active Tours',
      value: activeToursCount,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Heart,
      label: 'Wishlist',
      value: savedCount,
      color: 'text-rose-600 bg-rose-50',
      onClick: () => navigate('/wishlist'),
    },
    {
      icon: Award,
      label: 'Traveler Level',
      value: loyaltyLevel.charAt(0).toUpperCase() + loyaltyLevel.slice(1),
      color: getLoyaltyColor() + ' bg-amber-50',
      isText: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className={`flex items-center gap-3 px-4 py-3 ${stat.onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
            >
              <div className={`p-2 rounded-lg ${stat.color.split(' ')[1]}`}>
                <Icon className={`w-4 h-4 ${stat.color.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.isText ? stat.color.split(' ')[0] : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusBar;
