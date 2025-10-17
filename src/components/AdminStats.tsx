import React from 'react';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

interface AdminStatsProps {
  toursCount: number;
  ordersCount: number;
  categoriesCount: number;
  totalRevenue?: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  toursCount,
  ordersCount,
  categoriesCount,
  totalRevenue = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Jami turlar"
        value={toursCount}
        icon={<Package className="w-6 h-6 text-blue-600" />}
        color="bg-blue-50"
      />
      <StatsCard
        title="Jami buyurtmalar"
        value={ordersCount}
        icon={<Users className="w-6 h-6 text-emerald-600" />}
        trend="+12%"
        trendUp={true}
        color="bg-emerald-50"
      />
      <StatsCard
        title="Kategoriyalar"
        value={categoriesCount}
        icon={<Package className="w-6 h-6 text-purple-600" />}
        color="bg-purple-50"
      />
      <StatsCard
        title="Jami daromad"
        value={`${totalRevenue.toLocaleString()} UZS`}
        icon={<DollarSign className="w-6 h-6 text-amber-600" />}
        trend="+8%"
        trendUp={true}
        color="bg-amber-50"
      />
    </div>
  );
};

export default AdminStats;
