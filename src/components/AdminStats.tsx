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
    <div className="group relative overflow-hidden rounded-[26px] border border-white/60 bg-white/70 px-6 py-7 shadow-[0_28px_78px_-45px_rgba(44,32,18,0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_36px_90px_-40px_rgba(44,32,18,0.55)]">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#F0E4D0] via-transparent to-transparent opacity-80" />
      <div className="absolute right-3 bottom-3 h-16 w-16 rounded-full bg-[#BFA480]/10 blur-2xl" />

      <div className="relative flex items-center justify-between mb-6">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} shadow-inner shadow-white/40`}>{icon}</div>
        {trend && (
          <div
            className={`flex items-center space-x-1 rounded-full border border-white/60 px-3 py-1 text-xs font-semibold backdrop-blur-sm ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`}
          >
            <TrendingUp className={`w-4 h-4 ${!trendUp ? 'rotate-180' : ''}`} />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="relative text-3xl font-semibold text-[#2C2319] tracking-tight">{value}</div>
      <div className="relative mt-3 text-sm font-medium uppercase tracking-[0.32em] text-[#8E7A5E]">{title}</div>
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
      <StatsCard
        title="Jami turlar"
        value={toursCount}
        icon={<Package className="w-6 h-6 text-[#2F3A4A]" />}
        color="bg-[#E0E9FF]"
      />
      <StatsCard
        title="Jami buyurtmalar"
        value={ordersCount}
        icon={<Users className="w-6 h-6 text-[#2F4A3A]" />}
        trend="+12%"
        trendUp={true}
        color="bg-[#DFF4EA]"
      />
      <StatsCard
        title="Kategoriyalar"
        value={categoriesCount}
        icon={<TrendingUp className="w-6 h-6 text-[#432F4A]" />}
        color="bg-[#EDE2F8]"
      />
      <StatsCard
        title="Jami daromad"
        value={`${totalRevenue.toLocaleString()} UZS`}
        icon={<DollarSign className="w-6 h-6 text-[#654321]" />}
        trend="+8%"
        trendUp={true}
        color="bg-[#F7ECD6]"
      />
    </div>
  );
};

export default AdminStats;
