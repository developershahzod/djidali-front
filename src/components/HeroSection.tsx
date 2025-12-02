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
    <div className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/m1.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      </div>

      <div className="relative z-10 max-w-[min(1400px,90vw)] mx-auto px-[clamp(20px,4vw,64px)] h-full flex flex-col justify-center pb-0 pt-30">
        <div className="mb-[clamp(40px,6.67vw,96px)]">
          <h1 className="text-[clamp(32px,5.5vw,88px)] leading-[1.12] font-light text-white tracking-tight">
            {translate({
              ru: "ДАЛЬВЕРЗИН - лесоохотничье хозяйство",
              uz: "DALVARZIN - o'rmon va ov xo'jaligi",
              en: "DALVERZIN - Forest and Hunting Reserve",
              de: "DALVERZIN - Forst- und Jagdwirtschaft",
            })}
          </h1>
        </div>

        <div className="max-w-[min(1400px,100%)] w-full">
          <div className="rounded-[20px] shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[clamp(12px,1.11vw,16px)]">
            {/* Куда (Destination) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
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
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
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
              </select>
            </div>

            {/* Тип тура (Tour Type) */}
            <div className="bg-white rounded-xl p-[clamp(10px,0.83vw,12px)]">
              <label className="block text-[clamp(10px,0.76vw,11px)] text-gray-500 mb-0 ml-1 font-normal uppercase tracking-wide">
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
                className="w-full bg-white text-gray-900 text-[clamp(13px,1.04vw,15px)] font-medium outline-none focus:border-[#8B7355] transition-colors"
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
              className="p-[clamp(10px,0.83vw,12px)]"
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
              className="p-[clamp(10px,0.83vw,12px)]"
              maxGuests={9}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-[#8B7355] hover:bg-[#7A6349] text-white font-medium px-[clamp(20px,2.22vw,32px)] py-[clamp(12px,1.11vw,16px)] rounded-xl text-[clamp(13px,1.04vw,15px)] transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl flex items-center justify-center"
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
