import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  FolderTree,
  DollarSign,
  ShoppingCart,
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
    <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-slate-500">{title}</p>
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 tabular-nums mt-1">
            {value}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            {icon}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-0.5 text-xs font-medium ${
                trendUp ? "text-success-600" : "text-destructive-600"
              }`}
            >
              {trendUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Revenue by currency ────────────────────────────────────────────────────

const CURRENCY_META: Record<
  string,
  { symbol: string; color: string; label: string }
> = {
  USD: { symbol: "$", color: "text-emerald-600", label: "USD" },
  EUR: { symbol: "€", color: "text-blue-600", label: "EUR" },
  UZS: { symbol: "", color: "text-slate-900", label: "UZS" },
};

export const RevenueCard: React.FC<{
  revenueByCurrency?: Record<string, number>;
  totalRevenue?: number;
}> = ({ revenueByCurrency, totalRevenue }) => {
  const entries =
    revenueByCurrency && Object.keys(revenueByCurrency).length > 0
      ? Object.entries(revenueByCurrency)
      : [["UZS", totalRevenue || 0] as [string, number]];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 mb-2">Общий доход</p>
          <div className="flex flex-col gap-1.5">
            {entries.map(([currency, amount]) => {
              const meta = CURRENCY_META[currency] ?? {
                symbol: "",
                color: "text-slate-900",
                label: currency,
              };
              const formatted = (amount as number).toLocaleString("ru-RU");
              return (
                <div key={currency} className="flex items-baseline gap-1.5">
                  <span
                    className={`text-lg sm:text-xl font-semibold tabular-nums leading-tight ${meta.color}`}
                  >
                    {meta.symbol}
                    {formatted}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-0.5 text-xs font-medium text-success-600">
            <TrendingUp className="h-3 w-3" />
            <span>+8%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Orders by status ───────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; dot: string }> = {
  PENDING: { label: "Ожидание", dot: "bg-amber-400" },
  CONFIRMED: { label: "Подтверждено", dot: "bg-blue-500" },
  FULLY_PAID: { label: "Оплачено", dot: "bg-emerald-500" },
  COMPLETED: { label: "Завершено", dot: "bg-slate-400" },
  CANCELLED: { label: "Отменено", dot: "bg-red-400" },
  EXPIRED: { label: "Истекло", dot: "bg-gray-300" },
};

// Preferred display order
const STATUS_ORDER = [
  "PENDING",
  "CONFIRMED",
  "FULLY_PAID",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
];

export const OrdersByStatusCard: React.FC<{
  ordersByStatus?: Record<string, number>;
  total?: number;
}> = ({ ordersByStatus, total }) => {
  const entries =
    ordersByStatus && Object.keys(ordersByStatus).length > 0
      ? STATUS_ORDER.filter((s) => ordersByStatus[s] !== undefined).map(
          (s) => [s, ordersByStatus[s]] as [string, number],
        )
      : [];

  const displayTotal = total ?? entries.reduce((sum, [, n]) => sum + n, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 mb-1">Заказы</p>
          <p className="text-xl sm:text-2xl font-semibold text-slate-900 tabular-nums mb-2">
            {displayTotal}
          </p>
          <div className="flex flex-col gap-1">
            {entries.map(([status, count]) => {
              const meta = STATUS_META[status] ?? {
                label: status,
                dot: "bg-slate-300",
              };
              return (
                <div
                  key={status}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`}
                    />
                    <span className="text-[11px] text-slate-500 truncate">
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 tabular-nums flex-shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main AdminStats ────────────────────────────────────────────────────────

interface AdminStatsProps {
  toursCount: number;
  ordersCount: number;
  categoriesCount: number;
  totalRevenue?: number;
  revenueByCurrency?: Record<string, number>;
  ordersByStatus?: Record<string, number>;
}

const AdminStats: React.FC<AdminStatsProps> = ({
  toursCount,
  ordersCount,
  categoriesCount,
  totalRevenue = 0,
  revenueByCurrency,
  ordersByStatus,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Всего туров"
        value={toursCount}
        icon={<Package className="h-5 w-5" />}
      />
      <OrdersByStatusCard ordersByStatus={ordersByStatus} />
      <StatsCard
        title="Категорий"
        value={categoriesCount}
        icon={<FolderTree className="h-5 w-5" />}
      />
      <RevenueCard
        revenueByCurrency={revenueByCurrency}
        totalRevenue={totalRevenue}
      />
    </div>
  );
};

export default AdminStats;
