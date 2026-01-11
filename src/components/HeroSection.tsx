import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useLanguage } from "../contexts/LanguageContext";
import { DateRangePicker } from "./ui/DateRangePicker";
import { GuestSelector } from "./ui/GuestSelector";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [destination, setDestination] = useState("");
  const [tourType, setTourType] = useState("individual");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Guest state - adults as number, children as array of ages
  const [adults, setAdults] = useState(2);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);

  const handleSearch = () => {
    const params = new URLSearchParams({
      destination,
      type: tourType,
      ...(dateRange?.from && {
        startDate: format(dateRange.from, "yyyy-MM-dd"),
      }),
      ...(dateRange?.to && { endDate: format(dateRange.to, "yyyy-MM-dd") }),
      adults: adults.toString(),
      children: childrenAges.length.toString(),
      // Include children ages as comma-separated string
      ...(childrenAges.length > 0 && { childrenAges: childrenAges.join(",") }),
    });
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-width background */}
      <div
        className="absolute inset-0 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url('/banner.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Title - positioned at ~30% from top on mobile, higher on desktop */}
      <div className="absolute top-[25%] sm:top-[22%] md:top-[20%] lg:top-[180px] left-0 right-0 z-10 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[32px] sm:text-[38px] md:text-[48px] lg:text-[64px] xl:text-[80px] leading-[1.1] font-light text-white tracking-tight max-w-[90%] md:max-w-[70%]">
            {translate({
              ru: "ДАЛЬВЕРЗИН - лесоохотничье хозяйство",
              uz: "DALVARZIN - o'rmon va ov xo'jaligi",
              en: "DALVERZIN - Forest and Hunting Reserve",
              de: "DALVERZIN - Forst- und Jagdwirtschaft",
            })}
          </h1>
        </div>
      </div>

      {/* Form container - full width on mobile/tablet */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end pb-6 sm:pb-8 md:pb-10 lg:pb-[60px] px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="rounded-[16px] sm:rounded-[20px] shadow-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Куда (Destination) */}
            <div className="bg-white rounded-xl p-3 sm:p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[10px] sm:text-[11px] text-gray-500 mb-0.5 ml-1 font-normal uppercase tracking-wide">
                {translate({
                  ru: "Куда",
                  uz: "Qayerga",
                  en: "Where",
                  de: "Wohin",
                })}
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white text-gray-900 text-[14px] sm:text-[15px] font-medium outline-none focus:border-[#8B7355] transition-colors cursor-pointer"
              >
                <option value="">
                  {translate({
                    ru: "Выберите",
                    uz: "Tanlang",
                    en: "Select",
                    de: "Wählen",
                  })}
                </option>
                <option value="tashkent">
                  {translate({
                    ru: "Ташкент",
                    uz: "Toshkent",
                    en: "Tashkent",
                    de: "Taschkent",
                  })}
                </option>
                <option value="samarkand">
                  {translate({
                    ru: "Самарканд",
                    uz: "Samarqand",
                    en: "Samarkand",
                    de: "Samarkand",
                  })}
                </option>
                <option value="bukhara">
                  {translate({
                    ru: "Бухара",
                    uz: "Buxoro",
                    en: "Bukhara",
                    de: "Buchara",
                  })}
                </option>
                <option value="khiva">
                  {translate({
                    ru: "Хива",
                    uz: "Xiva",
                    en: "Khiva",
                    de: "Chiwa",
                  })}
                </option>
                <option value="dalverzin">
                  {translate({
                    ru: "Дальверзин",
                    uz: "Dalverzin",
                    en: "Dalverzin",
                    de: "Dalverzin",
                  })}
                </option>
              </select>
            </div>

            {/* Тип тура (Tour Type) */}
            <div className="bg-white rounded-xl p-3 sm:p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[10px] sm:text-[11px] text-gray-500 mb-0.5 ml-1 font-normal uppercase tracking-wide">
                {translate({
                  ru: "Тип тура",
                  uz: "Tur turi",
                  en: "Tour Type",
                  de: "Tourtyp",
                })}
              </label>
              <select
                value={tourType}
                onChange={(e) => setTourType(e.target.value)}
                className="w-full bg-white text-gray-900 text-[14px] sm:text-[15px] font-medium outline-none focus:border-[#8B7355] transition-colors cursor-pointer"
              >
                <option value="individual">
                  {translate({
                    ru: "Индивидуальный",
                    uz: "Individual",
                    en: "Individual",
                    de: "Individuell",
                  })}
                </option>
                <option value="group">
                  {translate({
                    ru: "Групповой",
                    uz: "Guruh",
                    en: "Group",
                    de: "Gruppe",
                  })}
                </option>
                <option value="family">
                  {translate({
                    ru: "Семейный",
                    uz: "Oilaviy",
                    en: "Family",
                    de: "Familie",
                  })}
                </option>
              </select>
            </div>

            {/* Дата (Date Range) */}
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              label={translate({
                ru: "Дата",
                uz: "Sana",
                en: "Date",
                de: "Datum",
              })}
              className="p-3 sm:p-[clamp(10px,0.83vw,12px)]"
            />

            {/* Участники (Guests) - New GuestSelector */}
            <GuestSelector
              adults={adults}
              childrenAges={childrenAges}
              onAdultsChange={setAdults}
              onChildrenChange={setChildrenAges}
              label={translate({
                ru: "Участники",
                uz: "Ishtirokchilar",
                en: "Guests",
                de: "Gäste",
              })}
              className="p-3 sm:p-[clamp(10px,0.83vw,12px)]"
              maxGuests={9}
            />

            {/* Search Button - spans full width on mobile, single col on tablet */}
            <button
              onClick={handleSearch}
              className="sm:col-span-2 md:col-span-1 lg:col-span-1 bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium px-6 py-4 sm:py-3 rounded-xl text-[15px] sm:text-[14px] transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {translate({
                ru: "Найти туры",
                uz: "Turlarni topish",
                en: "Find Tours",
                de: "Touren finden",
              })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
