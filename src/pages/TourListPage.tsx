import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TourListHero from "../components/TourListHero";
import LoadingSpinner from "../components/LoadingSpinner";
import { getTourPrimaryImage } from "../utils/imageUtils";
import { useLanguage } from "../contexts/LanguageContext";
import { useTours } from "../hooks/useTours";
import ScrollToTopButton from "../components/ScrollToTopButton";

export interface TourFilters {
  country: string;
  tourType: string;
  date: string;
  participants: string;
  priceFrom?: string;
  priceTo?: string;
  durationFrom?: string;
  durationTo?: string;
  sortBy?:
    | "price-asc"
    | "price-desc"
    | "duration-asc"
    | "duration-desc"
    | "popular";
}

// Helper function to safely extract localized text from multilingual objects
const getLocalizedText = (
  value: string | { [key: string]: string } | undefined | null,
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

const TourListPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<TourFilters>(() => {
    return {
      country: searchParams.get("destination") || "tashkent",
      tourType: searchParams.get("type") || "ecotourism",
      date: searchParams.get("startDate") || "sep-12-20",
      participants: searchParams.get("participants") || "family",
    };
  });

  const [activeFilters, setActiveFilters] = useState<TourFilters | null>(() => {
    const hasUrlParams =
      searchParams.get("destination") ||
      searchParams.get("type") ||
      searchParams.get("startDate") ||
      searchParams.get("participants");

    if (hasUrlParams) {
      return {
        country: searchParams.get("destination") || "tashkent",
        tourType: searchParams.get("type") || "ecotourism",
        date: searchParams.get("startDate") || "sep-12-20",
        participants: searchParams.get("participants") || "family",
      };
    }
    return null;
  });

  // Отдельное состояние для фронтенд фильтров (цена, длительность, сортировка)
  const [frontendFilters, setFrontendFilters] = useState<Partial<TourFilters>>(
    {},
  );

  // Маппинг значений фильтров для API
  const getApiParams = () => {
    if (!activeFilters) return {};

    const params: Record<string, string> = {};

    // Маппинг стран на destinations
    const countryMap: Record<string, string> = {
      tashkent: "Tashkent",
      samarkand: "Samarkand",
      bukhara: "Bukhara",
      khiva: "Khiva",
    };

    // Добавляем destination фильтр
    if (activeFilters.country) {
      params.destination =
        countryMap[activeFilters.country] || activeFilters.country;
    }

    // Добавляем тип тура (используем categoryId или search)
    if (activeFilters.tourType) {
      // Можно использовать categoryId если есть маппинг, или search для текстового поиска
      params.search = activeFilters.tourType;
    }

    // Добавляем даты если они есть в URL параметрах
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (startDateParam) {
      params.startDate = startDateParam;
    }

    if (endDateParam) {
      params.endDate = endDateParam;
    }

    console.log("🔍 Active Filters:", activeFilters);
    console.log("🔍 API Params:", params);
    console.log(
      "🔍 URL Search Params:",
      Object.fromEntries(searchParams.entries()),
    );

    return params;
  };

  const {
    tours: rawTours,
    loading,
    error,
    pagination,
  } = useTours({
    page: currentPage,
    limit: 100, // Загружаем больше для фильтрации на фронте
    accumulate: currentPage > 1,
    ...getApiParams(),
  });

  // Фильтрация и сортировка на фронтенде
  const tours = React.useMemo(() => {
    let filtered = [...rawTours];

    console.log("🔍 Raw tours:", rawTours.length);
    console.log("🔍 Frontend filters:", frontendFilters);

    // Фильтрация по цене
    if (frontendFilters?.priceFrom && frontendFilters.priceFrom !== "") {
      const priceFrom = parseFloat(frontendFilters.priceFrom);
      if (!isNaN(priceFrom)) {
        filtered = filtered.filter((tour) => {
          const price =
            typeof tour.price === "object"
              ? (tour.price as any)?.amount
              : tour.price;
          return price >= priceFrom;
        });
        console.log("🔍 After priceFrom filter:", filtered.length);
      }
    }

    if (frontendFilters?.priceTo && frontendFilters.priceTo !== "") {
      const priceTo = parseFloat(frontendFilters.priceTo);
      if (!isNaN(priceTo)) {
        filtered = filtered.filter((tour) => {
          const price =
            typeof tour.price === "object"
              ? (tour.price as any)?.amount
              : tour.price;
          return price <= priceTo;
        });
        console.log("🔍 After priceTo filter:", filtered.length);
      }
    }

    // Фильтрация по длительности
    if (frontendFilters?.durationFrom && frontendFilters.durationFrom !== "") {
      const durationFrom = parseInt(frontendFilters.durationFrom);
      if (!isNaN(durationFrom)) {
        filtered = filtered.filter(
          (tour) => (tour.duration || 0) >= durationFrom,
        );
        console.log("🔍 After durationFrom filter:", filtered.length);
      }
    }

    if (frontendFilters?.durationTo && frontendFilters.durationTo !== "") {
      const durationTo = parseInt(frontendFilters.durationTo);
      if (!isNaN(durationTo)) {
        filtered = filtered.filter(
          (tour) => (tour.duration || 0) <= durationTo,
        );
        console.log("🔍 After durationTo filter:", filtered.length);
      }
    }

    // Сортировка
    if (frontendFilters?.sortBy && frontendFilters.sortBy !== "popular") {
      filtered = [...filtered].sort((a, b) => {
        const priceA =
          typeof a.price === "object" ? (a.price as any)?.amount : a.price || 0;
        const priceB =
          typeof b.price === "object" ? (b.price as any)?.amount : b.price || 0;

        switch (frontendFilters.sortBy) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "duration-asc":
            return (a.duration || 0) - (b.duration || 0);
          case "duration-desc":
            return (b.duration || 0) - (a.duration || 0);
          default:
            return 0;
        }
      });
      console.log("🔍 After sorting:", frontendFilters.sortBy);
    }

    console.log("🔍 Final filtered tours:", filtered.length);
    return filtered;
  }, [rawTours, frontendFilters]);

  const handleSearch = () => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<TourFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Обновляем frontendFilters для немедленного применения фильтров/сортировки на фронте
    setFrontendFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const hasMoreTours = pagination ? currentPage < pagination.last_page : false;

  return (
    <div className="bg-[#F5F1E6] text-[#2A241C]">
      <TourListHero
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        totalTours={pagination?.total || tours.length}
      />

      <main className="bg-[#F4F2ED] py-[clamp(40px,6.67vw,96px)]">
        <div className="max-w-[min(1440px,100vw)] mx-auto px-[clamp(20px,3.47vw,50px)]">
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" color="emerald" />
            </div>
          )}

          {error && !loading && (
            <div className="bg-[#FCE8E6] border border-[#F5B1A8] text-[#8C342A] rounded-[20px] px-8 py-6 text-center">
              {t("common.error")} • {error}
            </div>
          )}

          <div className="flex flex-col gap-[20px]">
            {!loading &&
              !error &&
              tours.map((tour) => (
                <article
                  key={tour.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/tour/${tour.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/tour/${tour.id}`);
                    }
                  }}
                  className="group relative rounded-[20px] border-2 border-[silver] cursor-pointer transition-colors hover:bg-white hover:border-[#A5956D] focus:outline-none overflow-hidden"
                >
                  {/* Desktop & Tablet Layout */}
                  <div className="hidden lg:block relative h-[clamp(240px,20.49vw,295px)]">
                    {/* Левая часть - контент */}
                    <div className="absolute left-[clamp(20px,2.78vw,40px)] top-[clamp(20px,2.78vw,40px)] flex flex-col gap-[clamp(12px,1.39vw,20px)] w-[clamp(320px,38.68vw,557px)] text-[#333333]">
                      <h3
                        className="font-medium leading-[1.25] text-[clamp(20px,2.22vw,32px)] tracking-[-0.02em]"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {getLocalizedText(tour.title, language)}
                      </h3>
                      <p
                        className="font-normal leading-[1.2] text-[clamp(14px,1.39vw,20px)] tracking-[-0.02em]"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {tour.location || t("tour.defaultLocation")}
                      </p>
                    </div>

                    {/* Цена */}
                    <div
                      className="absolute left-[clamp(20px,2.78vw,40px)] bottom-[clamp(20px,2.78vw,40px)] flex flex-col gap-[clamp(6px,0.69vw,10px)] text-[#333333]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <p className="font-medium leading-[1.35] text-[clamp(18px,1.94vw,28px)] tracking-[-0.02em]">
                        {Number(
                          (typeof tour.price === "object"
                            ? (tour.price as any)?.amount
                            : tour.price) || 0,
                        ).toLocaleString("ru-RU")}{" "}
                        UZS
                      </p>
                      <p className="font-medium leading-[1] text-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                        {t("tour.from")}
                      </p>
                    </div>

                    {/* Вертикальный разделитель */}
                    <div className="absolute left-[clamp(140px,19.31vw,278px)] bottom-[clamp(22px,2.92vw,42px)] w-0 h-[clamp(40px,4.38vw,63px)] border-l border-[#333333] opacity-20"></div>

                    {/* Информация о туре */}
                    <div className="absolute left-[clamp(180px,22.78vw,328px)] bottom-[clamp(20px,2.78vw,40px)]">
                      <div
                        className="flex flex-col gap-[clamp(6px,0.69vw,10px)] text-[#333333]"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <p className="font-medium leading-[1.35] text-[clamp(18px,1.94vw,28px)] tracking-[-0.02em] whitespace-nowrap">
                          {tour.duration || 0} {t("tour.days")},{" "}
                          {t("tour.upTo")}{" "}
                          {tour.max_participants ??
                            (tour as any).maxParticipants ??
                            15}{" "}
                          {t("tour.people")}
                        </p>
                        <p className="font-medium leading-[1] text-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                          {t("home.popular.planIncludes")}
                        </p>
                      </div>
                    </div>

                    {/* Правая часть - изображение */}
                    <div className="absolute right-[clamp(12px,1.39vw,20px)] top-[clamp(12px,1.39vw,20px)] w-[clamp(280px,31.25vw,450px)] h-[clamp(216px,17.71vw,255px)] rounded-[20px] overflow-hidden">
                      <img
                        src={getTourPrimaryImage(tour)}
                        alt={getLocalizedText(tour.title, language)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>

                      {/* Бейдж категории */}
                      <div className="absolute bottom-[clamp(16px,2.22vw,32px)] right-[clamp(16px,2.22vw,32px)] bg-white rounded-[16px] px-[6px] py-[2px] z-10">
                        <p
                          className="font-medium leading-[16px] text-[clamp(14px,1.11vw,16px)] tracking-[-0.02em] text-[#333333]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {getLocalizedText(tour.category?.name, language) ||
                            "Экотуризм"}
                        </p>
                      </div>
                    </div>

                    {/* Кнопка-стрелка */}
                    <div className="absolute left-[clamp(480px,57.85vw,833px)] top-1/2 -translate-y-1/2 w-[clamp(60px,5.56vw,80px)] h-[clamp(60px,5.56vw,80px)] rounded-full bg-white flex items-center justify-center group-hover:bg-[#8F7B49] transition-colors">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#333333] group-hover:text-white transition-colors w-[clamp(28px,2.64vw,38px)] h-[clamp(28px,2.64vw,38px)]"
                      >
                        <path
                          d="M6.33334 19H31.6667"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22.1667 9.5L31.6667 19L22.1667 28.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Mobile & Small Tablet Layout */}
                  <div className="lg:hidden relative">
                    {/* Image on top */}
                    <div className="relative w-full h-[250px] rounded-t-[20px] overflow-hidden">
                      <img
                        src={getTourPrimaryImage(tour)}
                        alt={getLocalizedText(tour.title, language)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>

                      {/* Бейдж категории */}
                      <div className="absolute bottom-4 right-4 bg-white rounded-[16px] px-[6px] py-[2px] z-10">
                        <p
                          className="font-medium leading-[16px] text-[14px] tracking-[-0.28px] text-[#333333]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {getLocalizedText(tour.category?.name, language) ||
                            "Экотуризм"}
                        </p>
                      </div>
                    </div>

                    {/* Content below */}
                    <div className="p-6 flex flex-col gap-4 text-[#333333]">
                      <div className="flex flex-col gap-2">
                        <h3
                          className="font-medium leading-[1.3] text-[24px] tracking-[-0.48px]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {getLocalizedText(tour.title, language)}
                        </h3>
                        <p
                          className="font-normal leading-[1.4] text-[16px] tracking-[-0.32px]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {tour.location || t("tour.defaultLocation")}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333333]/10">
                        <div
                          className="flex flex-col gap-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <p className="font-medium leading-[1.4] text-[20px] tracking-[-0.4px]">
                            {Number(
                              (typeof tour.price === "object"
                                ? (tour.price as any)?.amount
                                : tour.price) || 0,
                            ).toLocaleString("ru-RU")}{" "}
                            UZS
                          </p>
                          <p className="font-medium leading-[1] text-[14px] tracking-[-0.28px]">
                            {t("tour.from")}
                          </p>
                        </div>

                        <div
                          className="flex flex-col gap-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <p className="font-medium leading-[1.4] text-[20px] tracking-[-0.4px]">
                            {tour.duration || 0} {t("tour.days")},{" "}
                            {tour.max_participants ??
                              (tour as any).maxParticipants ??
                              15}{" "}
                            {t("tour.people")}
                          </p>
                          <p className="font-medium leading-[1] text-[14px] tracking-[-0.28px]">
                            {t("home.popular.planIncludes")}
                          </p>
                        </div>
                      </div>

                      {/* Arrow button */}
                      <div className="flex justify-end">
                        <div className="w-[60px] h-[60px] rounded-full bg-white border-2 border-[silver] flex items-center justify-center group-hover:bg-[#8F7B49] group-hover:border-[#8F7B49] transition-colors">
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 38 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#333333] group-hover:text-white transition-colors"
                          >
                            <path
                              d="M6.33334 19H31.6667"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22.1667 9.5L31.6667 19L22.1667 28.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>

          {!loading && !error && tours.length === 0 && (
            <div className="rounded-[20px] bg-white/80 border-2 border-[silver] px-8 py-10 text-center text-[#333333]">
              {t("home.popular.emptyState")}
            </div>
          )}

          {!loading && !error && tours.length > 0 && hasMoreTours && (
            <div className="mt-[clamp(40px,5.56vw,80px)] flex justify-center">
              <button
                className="w-full border-2 border-[silver] rounded-[20px] px-[clamp(24px,2.78vw,40px)] py-[clamp(16px,1.81vw,26px)] flex items-center justify-center font-normal leading-[1.2] text-[clamp(16px,1.39vw,20px)] tracking-[-0.02em] text-[#333333] hover:bg-white/70 transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
                onClick={handleLoadMore}
              >
                {t("common.showMore")}
              </button>
            </div>
          )}

          {loading && currentPage > 1 && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" color="emerald" />
            </div>
          )}
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default TourListPage;
