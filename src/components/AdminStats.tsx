import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  FolderTree,
  DollarSign,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trendUp ? "text-success-600" : "text-destructive-600"
            }`}
          >
            {trendUp ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-slate-900 tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-sm text-slate-500">{title}</p>
      </div>
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Всего туров"
        value={toursCount}
        icon={<Package className="h-5 w-5" />}
      />
      <StatsCard
        title="Всего заказов"
        value={ordersCount}
        icon={<Users className="h-5 w-5" />}
        trend="+12%"
        trendUp={true}
      />
      <StatsCard
        title="Категорий"
        value={categoriesCount}
        icon={<FolderTree className="h-5 w-5" />}
      />
      <StatsCard
        title="Общий доход"
        value={`${totalRevenue.toLocaleString()} UZS`}
        icon={<DollarSign className="h-5 w-5" />}
        trend="+8%"
        trendUp={true}
      />
    </div>
  );
};

export default AdminStats;
