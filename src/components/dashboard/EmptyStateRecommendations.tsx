import React, { useEffect, useState } from "react";
import { Compass, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TourRecommendationCard from "./TourRecommendationCard";
import { djidaliApi } from "../../services/djidaliApi";
import { useLanguage } from "../../contexts/LanguageContext";

interface MultilingualText {
  uz?: string;
  ru?: string;
  eng?: string;
  de?: string;
}

interface Tour {
  id: string;
  title?: string | MultilingualText;
  titleRu?: string;
  titleUz?: string;
  titleEng?: string;
  destination?: string;
  location?: string;
  images?: (string | { url?: string; imageUrl?: string })[];
  price?: number | { amount: number };
  currency?: string;
  duration?: number;
  rating?: number;
  reviewCount?: number;
  maxParticipants?: number;
}

interface EmptyStateRecommendationsProps {
  showHero?: boolean;
}

const EmptyStateRecommendations: React.FC<EmptyStateRecommendationsProps> = ({
  showHero = true,
}) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await djidaliApi.getTours({
          limit: 6,
          status: "ACTIVE",
        });
        const tourData = response.data || response;
        setTours(Array.isArray(tourData) ? tourData.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const extractString = (
    value: string | MultilingualText | undefined,
    lang: string,
  ): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const langKey = lang === "en" ? "eng" : lang;
      return (
        value[langKey as keyof MultilingualText] ||
        value.ru ||
        value.uz ||
        value.eng ||
        ""
      );
    }
    return "";
  };

  const getTourTitle = (tour: Tour): string => {
    // First try language-specific fields
    if (language === "ru" && tour.titleRu) return tour.titleRu;
    if (language === "uz" && tour.titleUz) return tour.titleUz;
    if ((language === "en" || language === "eng") && tour.titleEng)
      return tour.titleEng;

    // Then try the title field (might be string or multilingual object)
    if (tour.title) {
      const extracted = extractString(tour.title, language);
      if (extracted) return extracted;
    }

    // Fallback to any available title
    return (
      tour.titleRu ||
      tour.titleUz ||
      tour.titleEng ||
      t("dashboard.emptyState.untitledTour")
    );
  };

  const getTourPrice = (tour: Tour): number => {
    if (typeof tour.price === "number") return tour.price;
    if (tour.price && typeof tour.price === "object") return tour.price.amount;
    return 0;
  };

  const getTourImage = (tour: Tour): string => {
    if (tour.images && tour.images.length > 0) {
      const img = tour.images[0];
      if (typeof img === "string") return img;
      if (typeof img === "object")
        return img.url || img.imageUrl || "/placeholder-tour.jpg";
    }
    return "/placeholder-tour.jpg";
  };

  return (
    <div className="space-y-8">
      {/* Hero Empty State - Only shown when showHero is true */}
      {showHero && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8f7b49]/10 via-amber-50 to-orange-50 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8f7b49]/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#8f7b49] mb-6">
              <Compass className="w-4 h-4" />
              <span>{t("dashboard.emptyState.adventureAwaits")}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("dashboard.emptyState.discoverNext")}
              <span className="text-[#8f7b49]">
                {" "}
                {t("dashboard.emptyState.unforgettableJourney")}
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t("dashboard.emptyState.noBookingsYet")}
            </p>

            <button
              onClick={() => navigate("/tours")}
              className="inline-flex items-center gap-2 bg-[#8f7b49] hover:bg-[#7a6839] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              {t("dashboard.emptyState.exploreAllTours")}
            </button>
          </div>
        </div>
      )}

      {/* Recommended Tours Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("dashboard.emptyState.recommendedForYou")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("dashboard.emptyState.popularTours")}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/tours")}
            className="text-sm font-semibold text-[#8f7b49] hover:text-[#7a6839] transition-colors"
          >
            {t("dashboard.emptyState.viewAll")}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
              <TourRecommendationCard
                key={tour.id}
                id={tour.id}
                title={getTourTitle(tour)}
                location={
                  extractString(tour.destination, language) ||
                  tour.location ||
                  t("dashboard.emptyState.defaultLocation")
                }
                image={getTourImage(tour)}
                price={getTourPrice(tour)}
                currency={tour.currency || "UZS"}
                duration={tour.duration || 1}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
                maxParticipants={tour.maxParticipants}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">
              {t("dashboard.emptyState.noToursAvailable")}
            </p>
            <button
              onClick={() => navigate("/tours")}
              className="mt-4 text-[#8f7b49] font-semibold hover:underline"
            >
              {t("dashboard.emptyState.browseAllTours")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyStateRecommendations;
