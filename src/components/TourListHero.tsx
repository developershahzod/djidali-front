import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useLanguage } from "../contexts/LanguageContext";
import { TourFilters } from "../pages/TourListPage";
import { DateRangePicker } from "./ui/DateRangePicker";
import { GuestSelector } from "./ui/GuestSelector";

const FIGMA_ASSETS = {
  iconBase: "/icons/icon-base.svg",
  iconFilter: "/icons/icon-filter.svg",
  iconSort: "/icons/icon-sort.svg",
  divider: "/icons/divider.svg",
} as const;

interface TourListHeroProps {
  filters: TourFilters;
  onFilterChange: (filters: Partial<TourFilters>) => void;
  onSearch: () => void;
  totalTours?: number;
}

const TourListHero: React.FC<TourListHeroProps> = ({
  filters,
  onFilterChange,
  onSearch,
  totalTours = 0,
}) => {
  const { translate } = useLanguage();
  const [destination, setDestination] = useState(filters.country || "");
  const [tourType, setTourType] = useState(filters.tourType || "individual");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Guest state - matching HeroSection
  const [adults, setAdults] = useState(2);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);

  // Filter/Sort modals state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<
    "price-asc" | "price-desc" | "duration-asc" | "duration-desc" | "popular"
  >("popular");
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [durationFrom, setDurationFrom] = useState<string>("");
  const [durationTo, setDurationTo] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const [sortPosition, setSortPosition] = useState({ top: 0, left: 0 });
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize dates from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startDateParam = urlParams.get("startDate");
    const endDateParam = urlParams.get("endDate");

    if (startDateParam || endDateParam) {
      setDateRange({
        from: startDateParam ? new Date(startDateParam) : undefined,
        to: endDateParam ? new Date(endDateParam) : undefined,
      });
    }
  }, []);

  // Close modals when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    const handleScroll = () => {
      setIsFilterOpen(false);
      setIsSortOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const handleSearch = () => {
    onFilterChange({
      country: destination,
      tourType: tourType,
      date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      participants: `${adults}${childrenAges.length > 0 ? `,${childrenAges.length}` : ""}`,
    });
    onSearch();
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Original TourListHero background */}
      <div className="absolute inset-0">
        <img
          src="/4c9440e694c34a2077b88db951060112fbd0015d.webp"
          alt="Tour background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-[min(1400px,90vw)] mx-auto px-[clamp(20px,4vw,64px)] h-full flex flex-col justify-end pb-[clamp(30px,4.17vw,60px)] pt-30">
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

            {/* Участники (Guests) */}
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

          {/* Filter and Sort Section */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-[16px] sm:gap-[40px] text-white">
            <div className="relative">
              <button
                ref={filterButtonRef}
                onClick={() => {
                  if (!isFilterOpen && filterButtonRef.current) {
                    const rect =
                      filterButtonRef.current.getBoundingClientRect();
                    setFilterPosition({
                      top: rect.bottom + window.scrollY + 10,
                      left: rect.left + window.scrollX,
                    });
                    setIsSortOpen(false);
                  }
                  setIsFilterOpen(!isFilterOpen);
                }}
                className="flex items-center gap-[16px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="overflow-clip relative shrink-0 h-[24px] w-[24px]">
                  <img
                    src={FIGMA_ASSETS.iconBase}
                    alt=""
                    className="block h-full w-full max-w-none"
                  />
                  <div className="absolute inset-[8.33%]">
                    <img
                      src={FIGMA_ASSETS.iconFilter}
                      alt=""
                      className="block h-full w-full max-w-none"
                    />
                  </div>
                </div>
                <span
                  className="text-[20px] font-normal leading-[24px] tracking-[-0.4px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {translate({
                    ru: "Фильтр",
                    uz: "Filtr",
                    en: "Filter",
                    de: "Filter",
                  })}
                </span>
              </button>

              {/* Filter Modal */}
              {isFilterOpen &&
                createPortal(
                  <div
                    ref={filterRef}
                    className="absolute bg-white rounded-xl shadow-2xl p-6 z-[9999] border border-gray-200 min-w-[320px]"
                    style={{
                      top: `${filterPosition.top}px`,
                      left: `${filterPosition.left}px`,
                    }}
                  >
                    <h3
                      className="text-[#333333] text-lg font-semibold mb-4"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {translate({
                        ru: "Дополнительные фильтры",
                        uz: "Qo'shimcha filtrlar",
                        en: "Additional Filters",
                        de: "Zusätzliche Filter",
                      })}
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm text-[#333333] mb-2 font-medium">
                          {translate({
                            ru: "Цена (UZS)",
                            uz: "Narx (UZS)",
                            en: "Price (UZS)",
                            de: "Preis (UZS)",
                          })}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder={translate({
                              ru: "От",
                              uz: "Dan",
                              en: "From",
                              de: "Von",
                            })}
                            value={priceFrom}
                            onChange={(e) => setPriceFrom(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                          />
                          <input
                            type="number"
                            placeholder={translate({
                              ru: "До",
                              uz: "Gacha",
                              en: "To",
                              de: "Bis",
                            })}
                            value={priceTo}
                            onChange={(e) => setPriceTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#333333] mb-2 font-medium">
                          {translate({
                            ru: "Длительность (дни)",
                            uz: "Davomiylik (kun)",
                            en: "Duration (days)",
                            de: "Dauer (Tage)",
                          })}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder={translate({
                              ru: "От",
                              uz: "Dan",
                              en: "From",
                              de: "Von",
                            })}
                            value={durationFrom}
                            onChange={(e) => setDurationFrom(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                          />
                          <input
                            type="number"
                            placeholder={translate({
                              ru: "До",
                              uz: "Gacha",
                              en: "To",
                              de: "Bis",
                            })}
                            value={durationTo}
                            onChange={(e) => setDurationTo(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#333333]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onFilterChange({
                            priceFrom,
                            priceTo,
                            durationFrom,
                            durationTo,
                          });
                          setIsFilterOpen(false);
                        }}
                        className="w-full bg-[#8F7B49] hover:bg-[#7A6640] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {translate({
                          ru: "Применить",
                          uz: "Qo'llash",
                          en: "Apply",
                          de: "Anwenden",
                        })}
                      </button>
                    </div>
                  </div>,
                  document.body,
                )}
            </div>

            <div className="flex h-[20px] w-[20px] items-center justify-center opacity-50">
              <img
                src={FIGMA_ASSETS.divider}
                alt=""
                className="h-[1px] w-[20px] rotate-90"
              />
            </div>

            <div className="relative">
              <button
                ref={sortButtonRef}
                onClick={() => {
                  if (!isSortOpen && sortButtonRef.current) {
                    const rect = sortButtonRef.current.getBoundingClientRect();
                    setSortPosition({
                      top: rect.bottom + window.scrollY + 10,
                      left: rect.left + window.scrollX,
                    });
                    setIsFilterOpen(false);
                  }
                  setIsSortOpen(!isSortOpen);
                }}
                className="flex items-center gap-[16px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="overflow-clip relative shrink-0 h-[24px] w-[24px]">
                  <img
                    src={FIGMA_ASSETS.iconBase}
                    alt=""
                    className="block h-full w-full max-w-none"
                  />
                  <div className="absolute bottom-[25%] left-[12.5%] right-[12.5%] top-[25%]">
                    <img
                      src={FIGMA_ASSETS.iconSort}
                      alt=""
                      className="block h-full w-full max-w-none"
                    />
                  </div>
                </div>
                <span
                  className="text-[20px] font-normal leading-[24px] tracking-[-0.4px]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {translate({
                    ru: "Сортировать",
                    uz: "Saralash",
                    en: "Sort",
                    de: "Sortieren",
                  })}
                </span>
              </button>

              {/* Sort Modal */}
              {isSortOpen &&
                createPortal(
                  <div
                    ref={sortRef}
                    className="absolute bg-white rounded-xl shadow-2xl p-4 z-[9999] border border-gray-200 min-w-[280px]"
                    style={{
                      top: `${sortPosition.top}px`,
                      left: `${sortPosition.left}px`,
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          value: "popular",
                          label: translate({
                            ru: "Популярные",
                            uz: "Mashhur",
                            en: "Popular",
                            de: "Beliebt",
                          }),
                        },
                        {
                          value: "price-asc",
                          label: translate({
                            ru: "Цена: по возрастанию",
                            uz: "Narx: o'sish",
                            en: "Price: Low to High",
                            de: "Preis: aufsteigend",
                          }),
                        },
                        {
                          value: "price-desc",
                          label: translate({
                            ru: "Цена: по убыванию",
                            uz: "Narx: kamayish",
                            en: "Price: High to Low",
                            de: "Preis: absteigend",
                          }),
                        },
                        {
                          value: "duration-asc",
                          label: translate({
                            ru: "Длительность: короткие",
                            uz: "Davomiylik: qisqa",
                            en: "Duration: Short",
                            de: "Dauer: kurz",
                          }),
                        },
                        {
                          value: "duration-desc",
                          label: translate({
                            ru: "Длительность: длинные",
                            uz: "Davomiylik: uzun",
                            en: "Duration: Long",
                            de: "Dauer: lang",
                          }),
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            const newSortOption =
                              option.value as typeof sortOption;
                            setSortOption(newSortOption);
                            onFilterChange({ sortBy: newSortOption });
                            setIsSortOpen(false);
                          }}
                          className={`text-left px-4 py-3 rounded-lg transition-colors ${
                            sortOption === option.value
                              ? "bg-[#8F7B49] text-white"
                              : "text-[#333333] hover:bg-gray-100"
                          }`}
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>,
                  document.body,
                )}
            </div>

            {/* Tours Count */}
            <div
              className="ml-auto text-white text-right text-[20px] font-light leading-[28px] tracking-[-0.4px]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="font-bold">
                {totalTours}{" "}
                {translate({
                  ru: "доступных",
                  uz: "mavjud",
                  en: "available",
                  de: "verfügbar",
                })}
              </span>{" "}
              {translate({
                ru: "туров",
                uz: "turlar",
                en: "tours",
                de: "Touren",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourListHero;
