import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  ChevronRight,
  RefreshCw,
  CreditCard,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { djidaliApi, ApiOrder } from "../services/djidaliApi";
import { clickPaymentService } from "../services/legacyClickPayment";
import { getImageUrl } from "../utils/imageUtils";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsGrid from "../components/dashboard/StatsGrid";
import EmptyStateRecommendations from "../components/dashboard/EmptyStateRecommendations";

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { language, translate } = useLanguage();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, "waiting" | "confirmed" | "rejected" | "error">
  >({});
  const [checkingPayment, setCheckingPayment] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      fetchWishlistCount();
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await djidaliApi.getOrders({ limit: 50 });
      if (Array.isArray(response)) {
        setOrders(response);
      } else if (response && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      // Try to get wishlist from API if available
      const wishlist = await djidaliApi.getWishlist?.();
      if (Array.isArray(wishlist)) {
        setWishlistCount(wishlist.length);
      } else if (wishlist?.data && Array.isArray(wishlist.data)) {
        setWishlistCount(wishlist.data.length);
      }
    } catch {
      // Wishlist API might not exist, keep count at 0
      setWishlistCount(0);
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    setCheckingPayment((prev) => ({ ...prev, [orderId]: true }));
    try {
      const status = await clickPaymentService.getPaymentStatus(orderId);
      setPaymentStatuses((prev) => ({ ...prev, [orderId]: status }));
    } catch (error) {
      console.error("Payment status check failed:", error);
      setPaymentStatuses((prev) => ({ ...prev, [orderId]: "error" }));
    } finally {
      setCheckingPayment((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        color: string;
        bg: string;
        labelKey: { ru: string; uz: string; en: string; de: string };
      }
    > = {
      FULLY_PAID: {
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        labelKey: {
          ru: "Оплачено",
          uz: "To'langan",
          en: "Paid",
          de: "Bezahlt",
        },
      },
      CONFIRMED: {
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200",
        labelKey: {
          ru: "Подтверждено",
          uz: "Tasdiqlangan",
          en: "Confirmed",
          de: "Bestätigt",
        },
      },
      PENDING: {
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
        labelKey: {
          ru: "Ожидает",
          uz: "Kutilmoqda",
          en: "Pending",
          de: "Ausstehend",
        },
      },
      CANCELLED: {
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
        labelKey: {
          ru: "Отменено",
          uz: "Bekor qilingan",
          en: "Cancelled",
          de: "Storniert",
        },
      },
    };
    const config = configs[status] || {
      color: "text-gray-700",
      bg: "bg-gray-50 border-gray-200",
      labelKey: { ru: status, uz: status, en: status, de: status },
    };
    return {
      ...config,
      label: translate(config.labelKey),
    };
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ").format(price);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: Record<string, string> = {
      ru: "ru-RU",
      uz: "uz-UZ",
      en: "en-US",
      de: "de-DE",
    };
    return date.toLocaleDateString(localeMap[language] || "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTourTitle = (tour: any) => {
    if (!tour)
      return translate({ ru: "Тур", uz: "Tur", en: "Tour", de: "Tour" });
    if (language === "ru" && tour.titleRu) return tour.titleRu;
    if (language === "uz" && tour.titleUz) return tour.titleUz;
    if ((language === "en" || language === "eng") && tour.titleEng)
      return tour.titleEng;

    if (tour.title && typeof tour.title === "object") {
      const langKey = language === "en" ? "eng" : language;
      return (
        tour.title[langKey] ||
        tour.title.ru ||
        tour.title.uz ||
        tour.title.eng ||
        translate({ ru: "Тур", uz: "Tur", en: "Tour", de: "Tour" })
      );
    }

    return (
      tour.title ||
      tour.titleRu ||
      tour.titleUz ||
      tour.titleEng ||
      translate({ ru: "Тур", uz: "Tur", en: "Tour", de: "Tour" })
    );
  };

  const getTourImage = (tour: any) => {
    if (!tour) return "/placeholder-tour.jpg";
    if (tour.images && tour.images.length > 0) {
      const img = tour.images[0];
      return typeof img === "string"
        ? img
        : img.url || img.imageUrl || "/placeholder-tour.jpg";
    }
    return "/placeholder-tour.jpg";
  };

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

  const activeOrders = orders.filter(
    (o) => o.status === "CONFIRMED" || o.status === "FULLY_PAID",
  );

  const getLoyaltyLevel = (): "bronze" | "silver" | "gold" => {
    if (orders.length > 5) return "gold";
    if (orders.length > 2) return "silver";
    return "bronze";
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#8f7b49] border-t-transparent" />
          <p className="text-gray-500 mt-4">
            {translate({
              ru: "Загрузка ваших поездок...",
              uz: "Sayohatlaringiz yuklanmoqda...",
              en: "Loading your trips...",
              de: "Ihre Reisen werden geladen...",
            })}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Grid */}
          <StatsGrid
            ordersCount={orders.length}
            activeToursCount={activeOrders.length}
            wishlistCount={wishlistCount}
            loyaltyLevel={getLoyaltyLevel()}
          />

          {/* Content Based on Orders */}
          {orders.length === 0 ? (
            <EmptyStateRecommendations />
          ) : (
            <>
              {/* Active/Upcoming Trips */}
              {activeOrders.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {translate({
                        ru: "Предстоящие поездки",
                        uz: "Kelgusi sayohatlar",
                        en: "Upcoming Trips",
                        de: "Bevorstehende Reisen",
                      })}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {activeOrders.length}{" "}
                      {translate({
                        ru: activeOrders.length === 1 ? "поездка" : "поездок",
                        uz: "sayohat",
                        en: activeOrders.length === 1 ? "trip" : "trips",
                        de: activeOrders.length === 1 ? "Reise" : "Reisen",
                      })}
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {activeOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Tour Image */}
                          <div className="md:w-64 lg:w-72 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                            <img
                              src={getImageUrl(getTourImage(order.tour))}
                              alt={getTourTitle(order.tour)}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                            {/* Status Badge on Image */}
                            <span
                              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusConfig(order.status).bg} ${getStatusConfig(order.status).color}`}
                            >
                              {getStatusConfig(order.status).label}
                            </span>
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 p-6">
                            <div className="mb-4">
                              <h3
                                className="text-xl font-semibold text-gray-900 mb-2 hover:text-[#8f7b49] transition-colors cursor-pointer"
                                onClick={() =>
                                  navigate(`/tour/${order.tourId}`)
                                }
                              >
                                {getTourTitle(order.tour)}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {order.tour?.destination && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {getLocalizedText(order.tour.destination)}
                                  </span>
                                )}
                                {order.tour?.duration && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {order.tour.duration}{" "}
                                    {translate({
                                      ru: "дн.",
                                      uz: "kun",
                                      en: "days",
                                      de: "Tage",
                                    })}
                                  </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  {order.participants}{" "}
                                  {translate({
                                    ru: "чел.",
                                    uz: "kishi",
                                    en: "travelers",
                                    de: "Reisende",
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Booking Details Row */}
                            <div className="flex flex-wrap items-center gap-6 text-sm py-4 border-t border-gray-100">
                              <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wide">
                                  {translate({
                                    ru: "Забронировано",
                                    uz: "Bron qilingan",
                                    en: "Booked",
                                    de: "Gebucht",
                                  })}
                                </p>
                                <p className="font-medium text-gray-900 mt-0.5">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                              <div>
                                <p className="text-gray-400 text-xs uppercase tracking-wide">
                                  {translate({
                                    ru: "Сумма",
                                    uz: "Jami",
                                    en: "Total",
                                    de: "Gesamt",
                                  })}
                                </p>
                                <p className="font-bold text-gray-900 mt-0.5">
                                  {formatPrice(order.totalAmount)}{" "}
                                  <span className="font-normal text-gray-500">
                                    UZS
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Payment Status & Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {translate({
                                    ru: "Оплата:",
                                    uz: "To'lov:",
                                    en: "Payment:",
                                    de: "Zahlung:",
                                  })}
                                </span>
                                {paymentStatuses[order.id] ? (
                                  <span
                                    className={`text-sm font-semibold ${
                                      paymentStatuses[order.id] === "confirmed"
                                        ? "text-emerald-600"
                                        : paymentStatuses[order.id] ===
                                            "rejected"
                                          ? "text-red-600"
                                          : paymentStatuses[order.id] ===
                                              "error"
                                            ? "text-orange-600"
                                            : "text-amber-600"
                                    }`}
                                  >
                                    {paymentStatuses[order.id] === "confirmed"
                                      ? translate({
                                          ru: "Оплачено",
                                          uz: "To'langan",
                                          en: "Paid",
                                          de: "Bezahlt",
                                        })
                                      : paymentStatuses[order.id] === "rejected"
                                        ? translate({
                                            ru: "Отклонено",
                                            uz: "Rad etilgan",
                                            en: "Failed",
                                            de: "Fehlgeschlagen",
                                          })
                                        : paymentStatuses[order.id] === "error"
                                          ? translate({
                                              ru: "Ошибка",
                                              uz: "Xato",
                                              en: "Error",
                                              de: "Fehler",
                                            })
                                          : translate({
                                              ru: "Ожидает",
                                              uz: "Kutilmoqda",
                                              en: "Pending",
                                              de: "Ausstehend",
                                            })}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => checkPaymentStatus(order.id)}
                                    disabled={checkingPayment[order.id]}
                                    className="text-sm text-[#8f7b49] hover:text-[#7a6839] font-medium flex items-center gap-1 transition-colors"
                                  >
                                    {checkingPayment[order.id] ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        {translate({
                                          ru: "Проверка...",
                                          uz: "Tekshirilmoqda...",
                                          en: "Checking...",
                                          de: "Prüfen...",
                                        })}
                                      </>
                                    ) : (
                                      translate({
                                        ru: "Проверить статус",
                                        uz: "Holatni tekshirish",
                                        en: "Check Status",
                                        de: "Status prüfen",
                                      })
                                    )}
                                  </button>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  navigate(`/tour/${order.tourId}`)
                                }
                                className="flex items-center gap-1 text-sm font-semibold text-[#8f7b49] hover:text-[#7a6839] transition-colors"
                              >
                                {translate({
                                  ru: "Подробнее",
                                  uz: "Batafsil",
                                  en: "View Details",
                                  de: "Details ansehen",
                                })}
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Past & Pending Trips */}
              {orders.filter(
                (o) => o.status !== "CONFIRMED" && o.status !== "FULLY_PAID",
              ).length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {translate({
                        ru: "Прошлые и ожидающие",
                        uz: "O'tgan va kutilayotgan",
                        en: "Past & Pending",
                        de: "Vergangene & Ausstehende",
                      })}
                    </h2>
                  </div>
                  <div className="grid gap-3">
                    {orders
                      .filter(
                        (o) =>
                          o.status !== "CONFIRMED" && o.status !== "FULLY_PAID",
                      )
                      .map((order) => (
                        <div
                          key={order.id}
                          onClick={() => navigate(`/tour/${order.tourId}`)}
                          className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                        >
                          <img
                            src={getImageUrl(getTourImage(order.tour))}
                            alt={getTourTitle(order.tour)}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {getTourTitle(order.tour)}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {formatDate(order.createdAt)} •{" "}
                              {order.participants}{" "}
                              {translate({
                                ru: "чел.",
                                uz: "kishi",
                                en: "travelers",
                                de: "Reisende",
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusConfig(order.status).bg} ${getStatusConfig(order.status).color}`}
                          >
                            {getStatusConfig(order.status).label}
                          </span>
                          <p className="font-bold text-gray-900 hidden sm:block whitespace-nowrap">
                            {formatPrice(order.totalAmount)}{" "}
                            <span className="font-normal text-gray-400 text-sm">
                              UZS
                            </span>
                          </p>
                          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Recommendations Section for Users with Orders */}
              <section className="pt-4">
                <EmptyStateRecommendations showHero={false} />
              </section>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
