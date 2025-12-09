import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import AdminLayout from "../../layouts/AdminLayout";
import { djidaliApi } from "../../services/djidaliApi";
import { formatCurrency } from "../../lib/utils";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalTours: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
}

interface SalesData {
  data: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  total: {
    orders: number;
    revenue: number;
  };
}

interface TourStats {
  totalTours: number;
  activeTours: number;
  inactiveTours: number;
  toursByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  topTours: Array<{
    id: string;
    title: string;
    bookings: number;
    revenue: number;
  }>;
}

interface RevenueData {
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercent: number;
  data: Array<{
    label: string;
    value: number;
  }>;
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = "primary",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: "primary" | "green" | "blue" | "purple" | "orange";
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    orange:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              {trend >= 0 ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
                {trend >= 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="ml-1 text-gray-500">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};

const SimpleBarChart = ({
  data,
  label,
}: {
  data: Array<{ label: string; value: number }>;
  label: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="space-y-2">
        {data.slice(0, 7).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-16 text-xs text-gray-500 truncate">
              {item.label}
            </span>
            <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-20 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const { language } = useLanguage();

  // Helper function to safely extract localized text from multilingual objects
  const getLocalizedText = (
    value: string | { [key: string]: string } | undefined | null,
  ): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const langKey = language === "en" ? "eng" : language;
      return value[langKey] || value.ru || value.eng || value.uz || "";
    }
    return "";
  };
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">(
    "month",
  );
  const [salesGroupBy, setSalesGroupBy] = useState<"day" | "week" | "month">(
    "day",
  );

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [tourStats, setTourStats] = useState<TourStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

  const fetchAnalytics = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      // Calculate date range for sales (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const [dashboard, sales, tours, revenue] = await Promise.allSettled([
        djidaliApi.getDashboardStatistics(),
        djidaliApi.getSalesStatistics({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          groupBy: salesGroupBy,
        }),
        djidaliApi.getTourStatistics(),
        djidaliApi.getRevenueStatistics(period),
      ]);

      if (dashboard.status === "fulfilled") {
        setDashboardStats(dashboard.value);
      }
      if (sales.status === "fulfilled") {
        setSalesData(sales.value);
      }
      if (tours.status === "fulfilled") {
        setTourStats(tours.value);
      }
      if (revenue.status === "fulfilled") {
        setRevenueData(revenue.value);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, salesGroupBy]);

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Analytics & Reports"
      actions={
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      }
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats?.totalRevenue || 0)}
          icon={<DollarSign className="h-6 w-6" />}
          trend={revenueData?.changePercent}
          trendLabel="vs last period"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats?.totalOrders || 0}
          icon={<ShoppingBag className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Active Tours"
          value={tourStats?.activeTours || 0}
          icon={<MapPin className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Customers"
          value={dashboardStats?.totalCustomers || 0}
          icon={<Users className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Order Status Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl bg-yellow-50 p-6 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Pending Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                {dashboardStats?.pendingOrders || 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="rounded-xl bg-green-50 p-6 dark:bg-green-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Completed Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-100">
                {dashboardStats?.completedOrders || 0}
              </p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Tours
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
                {tourStats?.totalTours || 0}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </h3>
            </div>
          </div>
          {revenueData?.data && revenueData.data.length > 0 ? (
            <SimpleBarChart data={revenueData.data} label="Revenue by Period" />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Tours by Category */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tours by Category
            </h3>
          </div>
          {tourStats?.toursByCategory &&
          tourStats.toursByCategory.length > 0 ? (
            <div className="space-y-4">
              {tourStats.toursByCategory.map((cat, index) => {
                const total = tourStats.toursByCategory.reduce(
                  (sum, c) => sum + c.count,
                  0,
                );
                const percentage = total > 0 ? (cat.count / total) * 100 : 0;
                const colors = [
                  "bg-primary",
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-purple-500",
                  "bg-orange-500",
                  "bg-pink-500",
                ];
                return (
                  <div key={cat.categoryId || index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {cat.categoryName || "Uncategorized"}
                      </span>
                      <span className="text-gray-500">
                        {cat.count} tours ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No category data available
            </div>
          )}
        </div>
      </div>

      {/* Top Tours */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Tours
          </h3>
        </div>
        {tourStats?.topTours && tourStats.topTours.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Tour
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tourStats.topTours.map((tour, index) => (
                  <tr
                    key={tour.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {index + 1}
                        </span>
                        <span className="ml-3 font-medium text-gray-900 dark:text-white">
                          {getLocalizedText(tour.title)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                      {tour.bookings}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(tour.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No tour data available
          </div>
        )}
      </div>

      {/* Sales Trend */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sales Trend (Last 30 Days)
            </h3>
          </div>
          <select
            value={salesGroupBy}
            onChange={(e) =>
              setSalesGroupBy(e.target.value as typeof salesGroupBy)
            }
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="day">By Day</option>
            <option value="week">By Week</option>
            <option value="month">By Month</option>
          </select>
        </div>
        {salesData?.data && salesData.data.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {salesData.total.orders}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(salesData.total.revenue)}
                </p>
              </div>
            </div>
            <SimpleBarChart
              data={salesData.data.map((d) => ({
                label: new Date(d.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                value: d.revenue,
              }))}
              label="Daily Revenue"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No sales data available for this period
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
