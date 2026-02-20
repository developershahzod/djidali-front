import React from "react";
import { Briefcase, Calendar, Heart, Award } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface StatsGridProps {
  ordersCount: number;
  activeToursCount: number;
  wishlistCount: number;
  loyaltyLevel: "bronze" | "silver" | "gold";
}

const StatsGrid: React.FC<StatsGridProps> = ({
  ordersCount,
  activeToursCount,
  wishlistCount,
  loyaltyLevel,
}) => {
  const { translate } = useLanguage();

  const getLoyaltyLabel = (level: string) => {
    const labels: Record<
      string,
      { ru: string; uz: string; en: string; de: string }
    > = {
      bronze: { ru: "Бронза", uz: "Bronza", en: "Bronze", de: "Bronze" },
      silver: { ru: "Серебро", uz: "Kumush", en: "Silver", de: "Silber" },
      gold: { ru: "Золото", uz: "Oltin", en: "Gold", de: "Gold" },
    };
    return translate(labels[level] || labels.bronze);
  };

  const stats = [
    {
      icon: Briefcase,
      label: translate({
        ru: "Всего бронирований",
        uz: "Jami bronlar",
        en: "Total Bookings",
        de: "Buchungen gesamt",
      }),
      value: ordersCount,
      color: "text-[#8f7b49]",
      bgColor: "bg-[#8f7b49]/10",
    },
    {
      icon: Calendar,
      label: translate({
        ru: "Активные туры",
        uz: "Faol turlar",
        en: "Active Tours",
        de: "Aktive Touren",
      }),
      value: activeToursCount,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Heart,
      label: translate({
        ru: "Избранное",
        uz: "Sevimlilar",
        en: "Wishlist",
        de: "Wunschliste",
      }),
      value: wishlistCount,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
    {
      icon: Award,
      label: translate({
        ru: "Уровень",
        uz: "Daraja",
        en: "Traveler Level",
        de: "Reisestufe",
      }),
      value: getLoyaltyLabel(loyaltyLevel),
      color:
        loyaltyLevel === "gold"
          ? "text-amber-500"
          : loyaltyLevel === "silver"
            ? "text-gray-500"
            : "text-orange-600",
      bgColor:
        loyaltyLevel === "gold"
          ? "bg-amber-50"
          : loyaltyLevel === "silver"
            ? "bg-gray-50"
            : "bg-orange-50",
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-500 font-medium truncate">
                  {stat.label}
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold ${stat.isText ? stat.color : "text-gray-900"}`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
