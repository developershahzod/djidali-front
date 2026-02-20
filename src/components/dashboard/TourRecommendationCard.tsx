import React from "react";
import { Star, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { useLanguage } from "../../contexts/LanguageContext";

interface TourRecommendationCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  currency?: string;
  duration: number;
  rating?: number;
  reviewCount?: number;
  maxParticipants?: number;
  badge?: "popular" | "new" | "sale";
}

const TourRecommendationCard: React.FC<TourRecommendationCardProps> = ({
  id,
  title,
  location,
  image,
  price,
  currency = "UZS",
  duration,
  rating,
  reviewCount,
  maxParticipants,
  badge,
}) => {
  const navigate = useNavigate();
  const { translate } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price);
  };

  const formatRating = (value: number) => {
    return value.toFixed(1);
  };

  return (
    <div
      onClick={() => navigate(`/tour/${id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-tour.jpg";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge */}
        {badge && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
              badge === "popular"
                ? "bg-amber-500 text-white"
                : badge === "new"
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
            }`}
          >
            {badge === "popular"
              ? translate({
                  ru: "Популярный",
                  uz: "Mashhur",
                  en: "Popular",
                  de: "Beliebt",
                })
              : badge === "new"
                ? translate({ ru: "Новый", uz: "Yangi", en: "New", de: "Neu" })
                : translate({
                    ru: "Скидка",
                    uz: "Chegirma",
                    en: "Sale",
                    de: "Angebot",
                  })}
          </div>
        )}

        {/* Rating Badge - only show if rating exists */}
        {rating !== undefined && rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-900">
              {formatRating(rating)}
            </span>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Location on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium drop-shadow-lg">{location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-3 group-hover:text-[#8f7b49] transition-colors">
          {title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              {duration}{" "}
              {duration === 1
                ? translate({ ru: "день", uz: "kun", en: "day", de: "Tag" })
                : translate({ ru: "дней", uz: "kun", en: "days", de: "Tage" })}
            </span>
          </div>
          {maxParticipants && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {translate({
                  ru: "До",
                  uz: "Gacha",
                  en: "Up to",
                  de: "Bis zu",
                })}{" "}
                {maxParticipants}
              </span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">
              {translate({ ru: "От", uz: "Dan", en: "From", de: "Ab" })}
            </span>
            <p className="text-lg font-bold text-gray-900">
              {(() => {
                const formatted = new Intl.NumberFormat("en-US").format(price);
                if (currency === 'USD') return `$${formatted}`;
                if (currency === 'EUR') return `€${formatted}`;
                return <>{formatted} <span className="text-sm font-normal text-gray-500">UZS</span></>;
              })()}
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-[#8f7b49] group-hover:text-[#7a6839] transition-colors">
            {translate({
              ru: "Смотреть",
              uz: "Ko'rish",
              en: "View",
              de: "Ansehen",
            })}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourRecommendationCard;
