import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  MapPin,
  Plus,
  ShoppingBag,
  Users,
  Star,
  Tag,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import AdminLayout from "../../layouts/AdminLayout";
import { djidaliApi } from "../../services/djidaliApi";
import { formatCurrency } from "../../lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  description?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  description,
}: StatsCardProps) => (
  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
          {trend !== undefined && (
            <span
              className={`ml-2 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </p>
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
    </div>
  </div>
);

interface RecentOrder {
  id: string;
  tourName: string;
  customer: string;
  date: string;
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface PopularTour {
  id: string | number;
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
  image?: string;
}

// Helper to extract localized string from multilingual object
const getLocalizedText = (
  value: string | { [key: string]: string } | undefined,
  language: string,
): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const langKey = language === "en" ? "eng" : language;
    return value[langKey] || value.ru || value.eng || value.uz || "";
  }
  return "";
};

const DashboardPage = () => {
  const { t, language, translate } = useLanguage();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeTours: 0,
    newCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularTours, setPopularTours] = useState<PopularTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data from API
        const [ordersResponse, toursResponse] = await Promise.all([
          djidaliApi.getAdminOrders({ limit: 5 }),
          djidaliApi.getTours({ limit: 10 }),
        ]);

        // Calculate stats from real data
        const orders = ordersResponse.data || [];
        const tours = toursResponse.data || [];

        // Only count confirmed/completed orders for revenue
        const confirmedOrders = orders.filter(
          (order) =>
            order.status?.toUpperCase() === "CONFIRMED" ||
            order.status?.toUpperCase() === "COMPLETED",
        );
        const totalRevenue = confirmedOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0,
        );
        const activeTours = tours.filter((t) => t.status === "ACTIVE").length;

        setStats({
          totalRevenue,
          totalBookings: ordersResponse.total || orders.length,
          activeTours,
          newCustomers: orders.filter((o) => {
            const orderDate = new Date(o.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return orderDate >= thirtyDaysAgo;
          }).length,
        });

        // Transform orders for display
        setRecentOrders(
          orders.slice(0, 5).map((order) => ({
            id: order.orderNumber || order.id,
            tourName:
              getLocalizedText(order.tour?.title, language) ||
              translate({
                ru: "Неизвестный тур",
                uz: "Noma'lum tur",
                en: "Unknown Tour",
                de: "Unbekannte Tour",
              }),
            customer: order.user?.firstName
              ? `${order.user.firstName} ${order.user.lastName || ""}`
              : translate({
                  ru: "Клиент",
                  uz: "Mijoz",
                  en: "Customer",
                  de: "Kunde",
                }),
            date: order.createdAt,
            amount: order.totalAmount || 0,
            status: (order.status?.toLowerCase() || "pending") as
              | "pending"
              | "confirmed"
              | "completed"
              | "cancelled",
          })),
        );

        // Transform tours for popular tours display
        setPopularTours(
          tours.slice(0, 5).map((tour) => ({
            id: tour.id,
            name:
              getLocalizedText(tour.title, language) ||
              translate({
                ru: "Без названия",
                uz: "Nomsiz tur",
                en: "Unnamed Tour",
                de: "Unbenannte Tour",
              }),
            bookings: tour._count?.orders || 0,
            revenue: (tour._count?.orders || 0) * (tour.price?.amount || 0),
            rating: tour.averageRating || tour.rating || 0,
            image: tour.images?.[0] || tour.mainImage || undefined,
          })),
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats({
          totalRevenue: 0,
          totalBookings: 0,
          activeTours: 0,
          newCustomers: 0,
        });
        setRecentOrders([]);
        setPopularTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [language]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8f7b49]"></div>
      </div>
    );
  }

  const error = null; // This would come from your API in a real app
  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
          {translate({
            ru: "Ошибка загрузки панели",
            uz: "Panel yuklanmadi",
            en: "Error loading dashboard",
            de: "Fehler beim Laden des Dashboards",
          })}
        </h2>
      </div>
    );
  }

  return (
    <AdminLayout
      title={t("admin.dashboardOverview")}
      actions={
        <Link
          to="/admin/tours/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.addNewTour")}
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("admin.totalRevenue")}
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatsCard
          title={t("admin.totalBookings")}
          value={stats.totalBookings}
          icon={<ShoppingBag className="h-6 w-6" />}
        />
        <StatsCard
          title={t("admin.activeTours")}
          value={stats.activeTours}
          icon={<MapPin className="h-6 w-6" />}
        />
        <StatsCard
          title={t("admin.newCustomers")}
          value={stats.newCustomers}
          icon={<Users className="h-6 w-6" />}
          description={translate({
            ru: "За 30 дней",
            uz: "Oxirgi 30 kun",
            en: "Last 30 days",
            de: "Letzte 30 Tage",
          })}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {t("admin.recentOrders")}
            </h3>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              {t("admin.viewAll")}
            </Link>
          </div>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                        >
                          {t("admin.order")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t("admin.customer")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t("admin.date")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t("admin.amount")}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          {t("admin.status")}
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">{t("admin.view")}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            <div className="font-medium">{order.id}</div>
                            <div className="text-gray-500">
                              {order.tourName}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {order.customer}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {formatCurrency(order.amount)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-primary hover:text-primary/80"
                            >
                              {t("admin.view")}
                              <span className="sr-only">, {order.id}</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {t("admin.dashboard")}
            </h2>
            <Link
              to="/admin/tours"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              {t("admin.viewAll")}
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {popularTours.map((tour) => (
              <div
                key={tour.id}
                className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                  {tour.image ? (
                    <img
                      src={
                        tour.image.startsWith("http") ||
                        tour.image.startsWith("/api")
                          ? tour.image
                          : `/api/uploads/${tour.image}`
                      }
                      alt={tour.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {tour.name}
                    </h4>
                    <div className="flex items-center text-sm text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{tour.rating}</span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {tour.bookings}{" "}
                      {translate({
                        ru: "бронирований",
                        uz: "bron",
                        en: "bookings",
                        de: "Buchungen",
                      })}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatCurrency(tour.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {translate({
              ru: "Быстрые действия",
              uz: "Tezkor amallar",
              en: "Quick Actions",
              de: "Schnellaktionen",
            })}
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Actionable buttons first */}
          <Link
            to="/admin/tours/new"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
              {translate({
                ru: "Добавить тур",
                uz: "Tur qo'shish",
                en: "Add New Tour",
                de: "Neue Tour hinzufügen",
              })}
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              {translate({
                ru: "Создать новый тур",
                uz: "Yangi tur yaratish",
                en: "Create a new tour package",
                de: "Neues Tourpaket erstellen",
              })}
            </p>
          </Link>
          <Link
            to="/admin/categories/new"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center hover:border-primary hover:bg-primary/5 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Tag className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
              {translate({
                ru: "Добавить категорию",
                uz: "Kategoriya qo'shish",
                en: "Add Category",
                de: "Kategorie hinzufügen",
              })}
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              {translate({
                ru: "Создать новую категорию",
                uz: "Yangi kategoriya yaratish",
                en: "Create a new tour category",
                de: "Neue Tourkategorie erstellen",
              })}
            </p>
          </Link>

          {/* Coming Soon buttons */}
          <div className="relative flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center cursor-not-allowed dark:border-gray-700 dark:bg-gray-800/50">
            <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 rounded dark:text-amber-300 dark:bg-amber-900/50">
              {translate({
                ru: "Скоро",
                uz: "Tez kunda",
                en: "Coming Soon",
                de: "Bald verfügbar",
              })}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100/60 text-green-500 dark:bg-green-900/20 dark:text-green-500">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              {translate({
                ru: "Создать бронь",
                uz: "Bron yaratish",
                en: "Create Booking",
                de: "Buchung erstellen",
              })}
            </h4>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {translate({
                ru: "Создать бронь вручную",
                uz: "Qo'lda bron yaratish",
                en: "Manually create a new booking",
                de: "Buchung manuell erstellen",
              })}
            </p>
          </div>
          <div className="relative flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center cursor-not-allowed dark:border-gray-700 dark:bg-gray-800/50">
            <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 rounded dark:text-amber-300 dark:bg-amber-900/50">
              {translate({
                ru: "Скоро",
                uz: "Tez kunda",
                en: "Coming Soon",
                de: "Bald verfügbar",
              })}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100/60 text-blue-500 dark:bg-blue-900/20 dark:text-blue-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              {translate({
                ru: "Аналитика",
                uz: "Tahlillar",
                en: "View Analytics",
                de: "Analytik anzeigen",
              })}
            </h4>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {translate({
                ru: "Отчёты по бронированиям и доходам",
                uz: "Bron va daromad hisobotlari",
                en: "View booking and revenue reports",
                de: "Buchungs- und Umsatzberichte anzeigen",
              })}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
