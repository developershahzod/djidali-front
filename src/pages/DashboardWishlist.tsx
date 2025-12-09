import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  Filter,
  MapPin,
  Clock,
  Star,
  Users,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useConfirm } from "../contexts/ConfirmContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useTours } from "../hooks/useTours";
import {
  getWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from "../utils/wishlist";
import { getImageUrl } from "../utils/imageUtils";

const DashboardWishlist: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { confirm } = useConfirm();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("added");
  const [loading, setLoading] = useState(true);

  const { tours: allTours } = useTours({ per_page: 100, autoFetch: true });

  const wishlistItems = allTours.filter((tour) =>
    wishlistIds.includes(tour.id.toString()),
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadWishlist = () => {
      const items = getWishlistItems();
      setWishlistIds(items);
      setLoading(false);
    };

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, []);

  const handleRemoveFromWishlist = (tourId: string) => {
    removeFromWishlist(tourId);
  };

  const handleClearWishlist = async () => {
    const confirmed = await confirm({
      title:
        language === "ru"
          ? "Очистить избранное"
          : language === "uz"
            ? "Sevimlilarni tozalash"
            : language === "de"
              ? "Wunschliste leeren"
              : "Clear Wishlist",
      message:
        language === "ru"
          ? "Вы уверены, что хотите удалить все туры из избранного?"
          : language === "uz"
            ? "Barcha turlarni sevimlilardan o'chirmoqchimisiz?"
            : language === "de"
              ? "Möchten Sie wirklich alle Touren aus der Wunschliste entfernen?"
              : "Are you sure you want to clear all items from your wishlist?",
      confirmText:
        language === "ru"
          ? "Очистить"
          : language === "uz"
            ? "Tozalash"
            : language === "de"
              ? "Leeren"
              : "Clear All",
      cancelText:
        language === "ru"
          ? "Отмена"
          : language === "uz"
            ? "Bekor qilish"
            : language === "de"
              ? "Abbrechen"
              : "Cancel",
      variant: "warning",
    });

    if (confirmed) {
      clearWishlist();
    }
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "duration":
        return a.duration - b.duration;
      default:
        return 0;
    }
  });

  const getTourTitle = (tour: any) => {
    if (language === "ru" && tour.titleRu) return tour.titleRu;
    if (language === "uz" && tour.titleUz) return tour.titleUz;
    if (language === "de" && tour.titleDe) return tour.titleDe;
    if ((language === "en" || language === "eng") && tour.titleEng)
      return tour.titleEng;

    if (tour.title && typeof tour.title === "object") {
      const langKey = language === "en" ? "eng" : language;
      return (
        tour.title[langKey] ||
        tour.title.ru ||
        tour.title.uz ||
        tour.title.eng ||
        "Tour"
      );
    }

    return (
      tour.title || tour.titleRu || tour.titleUz || tour.titleEng || "Tour"
    );
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

  const getTourImage = (tour: any) => {
    if (tour.images && tour.images.length > 0) {
      const img = tour.images[0];
      return typeof img === "string"
        ? img
        : img.url || img.imageUrl || "/placeholder-tour.jpg";
    }
    return "/placeholder-tour.jpg";
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("uz-UZ").format(price);

  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ru: "Избранное",
        uz: "Sevimlilar",
        de: "Wunschliste",
        en: "Wishlist",
      },
      saved: {
        ru: "сохраненных туров",
        uz: "saqlangan turlar",
        de: "gespeicherte Touren",
        en: "saved tours",
      },
      clearAll: {
        ru: "Очистить все",
        uz: "Hammasini tozalash",
        de: "Alle löschen",
        en: "Clear All",
      },
      sortBy: {
        ru: "Сортировать",
        uz: "Saralash",
        de: "Sortieren",
        en: "Sort by",
      },
      addedTime: {
        ru: "По времени добавления",
        uz: "Qo'shilgan vaqti",
        de: "Hinzugefügt",
        en: "Recently added",
      },
      byPrice: {
        ru: "По цене",
        uz: "Narx bo'yicha",
        de: "Nach Preis",
        en: "By price",
      },
      byRating: {
        ru: "По рейтингу",
        uz: "Reyting bo'yicha",
        de: "Nach Bewertung",
        en: "By rating",
      },
      byDuration: {
        ru: "По длительности",
        uz: "Davomiyligi bo'yicha",
        de: "Nach Dauer",
        en: "By duration",
      },
      empty: {
        ru: "Ваш список избранного пуст",
        uz: "Sevimlilar ro'yxati bo'sh",
        de: "Ihre Wunschliste ist leer",
        en: "Your wishlist is empty",
      },
      emptyDesc: {
        ru: "Добавляйте понравившиеся туры, чтобы вернуться к ним позже",
        uz: "Keyinroq qaytish uchun yoqtirgan turlarni qo'shing",
        de: "Fügen Sie Touren hinzu, die Ihnen gefallen, um später darauf zurückzukommen",
        en: "Save tours you like to come back to them later",
      },
      exploreTours: {
        ru: "Посмотреть туры",
        uz: "Turlarni ko'rish",
        de: "Touren erkunden",
        en: "Explore Tours",
      },
      days: { ru: "дней", uz: "kun", de: "Tage", en: "days" },
      remove: { ru: "Удалить", uz: "O'chirish", de: "Entfernen", en: "Remove" },
    };
    return texts[key]?.[language] || texts[key]?.en || key;
  };

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout title={getText("title")}>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#8f7b49] border-t-transparent" />
          <p className="text-gray-500 mt-4">Loading...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getText("title")}
                </h1>
                <p className="text-gray-500">
                  {wishlistItems.length} {getText("saved")}
                </p>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearWishlist}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{getText("clearAll")}</span>
              </button>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <>
              {/* Sort */}
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {getText("sortBy")}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#8f7b49]/20 focus:border-[#8f7b49] bg-white"
                >
                  <option value="added">{getText("addedTime")}</option>
                  <option value="price">{getText("byPrice")}</option>
                  <option value="rating">{getText("byRating")}</option>
                  <option value="duration">{getText("byDuration")}</option>
                </select>
              </div>

              {/* Tours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map((tour) => (
                  <div
                    key={tour.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={getImageUrl(getTourImage(tour))}
                        alt={getTourTitle(tour)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          handleRemoveFromWishlist(tour.id.toString())
                        }
                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-500 text-gray-600 hover:text-white rounded-full transition-all shadow-sm"
                        title={getText("remove")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Rating */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-900">
                          {tour.rating?.toFixed(1) || "4.5"}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium drop-shadow-lg">
                          {getLocalizedText(tour.destination) ||
                            tour.location ||
                            "Uzbekistan"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3
                        className="font-semibold text-gray-900 text-base line-clamp-2 mb-3 cursor-pointer hover:text-[#8f7b49] transition-colors"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      >
                        {getTourTitle(tour)}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {tour.duration} {getText("days")}
                          </span>
                        </div>
                        {tour.maxParticipants && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{tour.maxParticipants}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-xs text-gray-500">From</span>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(tour.price)}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              UZS
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => navigate(`/tour/${tour.id}`)}
                          className="text-sm font-semibold text-[#8f7b49] hover:text-[#7a6839] transition-colors"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {getText("empty")}
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {getText("emptyDesc")}
              </p>
              <button
                onClick={() => navigate("/tours")}
                className="bg-[#8f7b49] hover:bg-[#7a6839] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
              >
                {getText("exploreTours")}
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardWishlist;
