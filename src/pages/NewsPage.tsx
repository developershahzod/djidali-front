import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { apiService, News } from "../services/api";

// Import images with local paths
const heroImage = "../public/about-hero.webp";
const largeCardBg2 = "../public/fcd4ea8bf176e4851a46f14de3020f62faed656d.jpg";

// Helper to get localized field from News item
const getLocalizedField = (
  item: News,
  field: "title" | "content" | "excerpt",
  lang: "ru" | "uz" | "en" | "de",
): string => {
  // If API already provided localized field
  if (item[field]) return item[field] as string;

  // Map language code to field suffix
  const langMap: Record<string, string> = {
    ru: "Ru",
    uz: "Uz",
    en: "Eng",
    de: "De",
  };

  const suffix = langMap[lang] || "Uz";
  const fieldName = `${field}${suffix}` as keyof News;

  // Try requested language, then fallback to Uz, then Ru
  return (
    (item[fieldName] as string) ||
    (item[`${field}Uz` as keyof News] as string) ||
    (item[`${field}Ru` as keyof News] as string) ||
    ""
  );
};

// Hero Section with Search
interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  newsCount: number;
  isLoading: boolean;
}

function Hero({
  searchQuery,
  onSearchChange,
  newsCount,
  isLoading,
}: HeroProps) {
  const { translate } = useLanguage();

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      {/* Background image - full width */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img
          alt=""
          className="absolute object-cover object-center size-full"
          src={heroImage}
        />
        <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
      </div>

      {/* Content container - centered with max-width for larger screens */}
      <div className="relative h-full w-full max-w-[1440px] mx-auto">
        {/* Title - Pixel perfect positioning */}
        <div className="absolute left-[20px] md:left-[50px] top-[120px] md:top-[150px] lg:top-[190px] w-[calc(100%-40px)] md:w-[900px] lg:w-[1340px]">
          <div className="font-['Montserrat',sans-serif] font-medium leading-[40px] md:leading-[70px] lg:leading-[100px] text-[32px] md:text-[60px] lg:text-[90px] text-white tracking-[-1.2px] md:tracking-[-2px] lg:tracking-[-2.7px] whitespace-pre-wrap">
            <p className="mb-0">
              {translate({
                ru: "Наши интересные",
                uz: "Bizning qiziqarli",
                en: "Our interesting",
                de: "Unsere interessanten",
              })}
            </p>
            <p className="mb-0">
              {translate({
                ru: "           и популярные новости",
                uz: "           va mashhur yangiliklar",
                en: "           and popular news",
                de: "           und beliebte Nachrichten",
              })}
            </p>
          </div>
        </div>

        {/* Decorative line - exact Figma position */}
        <div className="hidden lg:block absolute h-0 left-[120px] top-[357px] w-[100px]">
          <div className="absolute bottom-0 left-0 right-0 top-[-3px]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 100 6"
            >
              <line stroke="white" strokeWidth="6" x2="100" y1="3" y2="3" />
            </svg>
          </div>
        </div>

        {/* Search Container - exact Figma positioning */}
        <div className="absolute left-[20px] md:left-[50px] top-[280px] md:top-[380px] lg:top-[466px] flex flex-col md:flex-row gap-[10px] right-[20px] md:right-auto">
          <div className="flex-1 lg:w-[1150px] lg:flex-none bg-white h-[60px] md:h-[80px] rounded-[10px] border-2 border-white">
            <div className="flex flex-col gap-[10px] items-start justify-center h-full px-[15px] md:px-[20px] py-[18px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={translate({
                  ru: "Поиск новостей",
                  uz: "Yangiliklar qidirish",
                  en: "Search news",
                  de: "Nachrichten suchen",
                })}
                className="w-full font-['Montserrat',sans-serif] font-semibold text-[16px] md:text-[22px] leading-[24px] text-[#333333] opacity-50 tracking-[-0.44px] bg-transparent focus:outline-none focus:opacity-100 placeholder:opacity-50"
              />
            </div>
          </div>
          <button className="bg-[#8f7b49] hover:bg-[#7a6839] h-[60px] md:h-[80px] w-full md:w-[180px] rounded-[10px] flex items-center justify-center gap-[10px] px-[56px] py-[30px] transition-colors">
            <p className="font-['Montserrat',sans-serif] font-bold text-[18px] md:text-[20px] leading-[20px] text-white tracking-[-0.4px]">
              {translate({
                ru: "Поиск",
                uz: "Qidiruv",
                en: "Search",
                de: "Suche",
              })}
            </p>
          </button>
        </div>

        {/* Filter and Sort - exact Figma positioning */}
        <div className="hidden lg:flex absolute left-[50px] top-[626px] gap-[40px] items-center">
          <div className="flex gap-[16px] items-center cursor-pointer hover:opacity-80 transition-opacity">
            <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
              <path
                d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
                fill="white"
              />
            </svg>
            <p className="font-['Montserrat',sans-serif] font-normal text-[20px] leading-[24px] text-white tracking-[-0.4px]">
              {translate({
                ru: "Фильтр",
                uz: "Filtr",
                en: "Filter",
                de: "Filter",
              })}
            </p>
          </div>

          <div className="flex h-[20px] items-center justify-center w-0">
            <div className="rotate-90 h-0 w-[20px] border-t border-white/20" />
          </div>

          <div className="flex gap-[16px] items-center cursor-pointer hover:opacity-80 transition-opacity">
            <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"
                fill="white"
              />
            </svg>
            <p className="font-['Montserrat',sans-serif] font-normal text-[20px] leading-[24px] text-white tracking-[-0.4px]">
              {translate({
                ru: "Сортировать",
                uz: "Saralash",
                en: "Sort",
                de: "Sortieren",
              })}
            </p>
          </div>
        </div>

        {/* News Count - exact Figma positioning: bottom-[78px] right aligned */}
        <p className="hidden lg:block absolute bottom-[78px] right-[50px] font-['Montserrat',sans-serif] font-light text-[20px] leading-[28px] text-white text-right tracking-[-0.4px]">
          {isLoading ? (
            <span className="opacity-50">
              {translate({
                ru: "Загрузка...",
                uz: "Yuklanmoqda...",
                en: "Loading...",
                de: "Laden...",
              })}
            </span>
          ) : (
            <>
              <span className="font-['Montserrat',sans-serif] font-bold">
                {newsCount}{" "}
                {translate({
                  ru: "доступных",
                  uz: "mavjud",
                  en: "available",
                  de: "verfügbar",
                })}
              </span>
              <span>{` ${translate({ ru: "новостей", uz: "yangiliklar", en: "news", de: "Nachrichten" })}`}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// News Card Component
interface NewsCardProps {
  item: News;
  lang: "ru" | "uz" | "en" | "de";
  isLarge?: boolean;
}

function NewsCard({ item, lang, isLarge = false }: NewsCardProps) {
  const title = getLocalizedField(item, "title", lang);
  const excerpt =
    getLocalizedField(item, "excerpt", lang) ||
    getLocalizedField(item, "content", lang).substring(0, 200);

  // Build image URL
  const imageUrl = item.coverImage
    ? item.coverImage.startsWith("http")
      ? item.coverImage
      : `${import.meta.env.VITE_IMAGE_BASE_URL}${item.coverImage}`
    : "/public/placeholder-news.jpg";

  return (
    <Link
      to={`/news/${item.slug}`}
      className={`group block h-full ${isLarge ? "md:col-span-2" : ""}`}
    >
      <div className="flex flex-col h-full rounded-[10px] md:rounded-[20px] overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
        <div
          className={`relative ${isLarge ? "h-[250px] md:h-[350px] lg:h-[400px]" : "h-[200px] md:h-[250px] lg:h-[280px]"} overflow-hidden`}
        >
          <img
            alt={title}
            className="object-cover size-full transition-transform duration-700 group-hover:scale-105"
            src={imageUrl}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/public/placeholder-news.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Featured Badge */}
          {item.isFeatured && (
            <div className="absolute top-4 left-4 bg-[#8f7b49] text-white text-xs px-3 py-1 rounded-full font-semibold">
              Featured
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 md:gap-3 p-4 md:p-6 flex-1">
          <h3 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333333] text-[18px] md:text-[20px] lg:text-[22px] leading-[1.3] group-hover:text-[#8f7b49] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[#5c5c5c] text-[14px] md:text-[15px] lg:text-[16px] leading-[1.6] line-clamp-3">
            {excerpt.replace(/<[^>]*>/g, "")}
          </p>
          {item.publishedAt && (
            <p className="text-[#999] text-sm mt-auto">
              {new Date(item.publishedAt).toLocaleDateString(
                lang === "en"
                  ? "en-US"
                  : lang === "de"
                    ? "de-DE"
                    : lang === "uz"
                      ? "uz-UZ"
                      : "ru-RU",
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Loading Skeleton
function NewsCardSkeleton({ isLarge = false }: { isLarge?: boolean }) {
  return (
    <div className={`${isLarge ? "md:col-span-2" : ""}`}>
      <div className="flex flex-col h-full rounded-[10px] md:rounded-[20px] overflow-hidden bg-white">
        <div
          className={`relative ${isLarge ? "h-[250px] md:h-[350px] lg:h-[400px]" : "h-[200px] md:h-[250px] lg:h-[280px]"} bg-gray-200 animate-pulse`}
        />
        <div className="flex flex-col gap-2 md:gap-3 p-4 md:p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </div>
    </div>
  );
}

// News Grid Section
interface NewsGridProps {
  news: News[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lang: "ru" | "uz" | "en" | "de";
}

function NewsGrid({
  news,
  searchQuery,
  isLoading,
  error,
  lang,
}: NewsGridProps) {
  const { translate } = useLanguage();

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;

    const query = searchQuery.toLowerCase();
    return news.filter((item) => {
      const title = getLocalizedField(item, "title", lang).toLowerCase();
      const content = getLocalizedField(item, "content", lang).toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  }, [news, searchQuery, lang]);

  if (error) {
    return (
      <div className="w-full px-[20px] md:px-[50px] pt-10 md:pt-16 pb-12 md:pb-20">
        <div className="max-w-[1340px] mx-auto text-center py-20">
          <p className="font-['Montserrat:Medium',sans-serif] text-red-500 text-[18px] mb-4">
            {translate({
              ru: "Ошибка загрузки новостей",
              uz: "Yangiliklar yuklanmadi",
              en: "Error loading news",
              de: "Fehler beim Laden der Nachrichten",
            })}
          </p>
          <p className="text-[#666] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-[20px] md:px-[50px] pt-10 md:pt-16 pb-12 md:pb-20">
      <div className="max-w-[1340px] mx-auto">
        {/* Section Header */}
        <h2 className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333] text-[32px] md:text-[48px] lg:text-[60px] tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-1.8px] mb-8 md:mb-16 leading-tight">
          {translate({
            ru: "Новости",
            uz: "Yangiliklar",
            en: "News",
            de: "Nachrichten",
          })}
        </h2>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
              <NewsCardSkeleton isLarge />
              <NewsCardSkeleton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="flex flex-col gap-10">
            {/* First Row: Large featured card + Small card */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
              {/* Large Featured Card */}
              {filteredNews[0] && (
                <Link
                  to={`/news/${filteredNews[0].slug}`}
                  className="group block"
                >
                  <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-[10px] md:rounded-[20px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                    <img
                      alt={getLocalizedField(filteredNews[0], "title", lang)}
                      className="absolute inset-0 object-cover size-full transition-transform duration-700 group-hover:scale-105"
                      src={
                        filteredNews[0].coverImage
                          ? filteredNews[0].coverImage.startsWith("http")
                            ? filteredNews[0].coverImage
                            : `${import.meta.env.VITE_IMAGE_BASE_URL}${filteredNews[0].coverImage}`
                          : "/public/placeholder-news.jpg"
                      }
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/public/placeholder-news.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Featured Badge */}
                    {filteredNews[0].isFeatured && (
                      <div className="absolute top-6 left-6 bg-[#8f7b49] text-white text-sm px-4 py-2 rounded-full font-semibold">
                        Featured
                      </div>
                    )}

                    {/* Content at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                      <h3 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-white text-[20px] md:text-[26px] lg:text-[32px] leading-[1.3] mb-2 md:mb-4">
                        {getLocalizedField(filteredNews[0], "title", lang)}
                      </h3>
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal text-white/95 text-[14px] md:text-[16px] leading-[1.6] line-clamp-2">
                        {(
                          getLocalizedField(filteredNews[0], "excerpt", lang) ||
                          getLocalizedField(filteredNews[0], "content", lang)
                        )
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 200)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Small Card */}
              {filteredNews[1] && (
                <NewsCard item={filteredNews[1]} lang={lang} />
              )}
            </div>

            {/* Second Row: 3 Standard Cards */}
            {filteredNews.length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNews.slice(2, 5).map((item) => (
                  <NewsCard key={item.id} item={item} lang={lang} />
                ))}
              </div>
            )}

            {/* Third Row: 1 Card + Large Promotional Card */}
            {filteredNews.length > 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 md:gap-6">
                {/* Small Card */}
                <NewsCard item={filteredNews[5]} lang={lang} />

                {/* Large Promotional Card - Image only */}
                <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-[10px] md:rounded-[20px] overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300">
                  <img
                    alt=""
                    className="absolute inset-0 object-cover size-full transition-transform duration-700 group-hover:scale-105"
                    src={largeCardBg2}
                  />
                </div>
              </div>
            )}

            {/* Additional Cards if any */}
            {filteredNews.length > 6 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
                {filteredNews.slice(6).map((item) => (
                  <NewsCard key={item.id} item={item} lang={lang} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-['Montserrat:Medium',sans-serif] text-[#999] text-[18px]">
              {translate({
                ru: "Новости не найдены. Попробуйте изменить параметры поиска.",
                uz: "Yangiliklar topilmadi. Qidiruv parametrlarini o'zgartirib ko'ring.",
                en: "No news found. Try changing the search parameters.",
                de: "Keine Nachrichten gefunden. Versuchen Sie, die Suchparameter zu ändern.",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main NewsPage Component
export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Map language context to API language code
  const apiLang = useMemo(() => {
    const langMap: Record<string, "uz" | "ru" | "eng" | "de"> = {
      uz: "uz",
      ru: "ru",
      en: "eng",
      de: "de",
    };
    return langMap[language] || "ru";
  }, [language]);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.getNews({ lang: apiLang, limit: 20 });
        setNews(response.data || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(err instanceof Error ? err.message : "Failed to load news");
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [apiLang]);

  return (
    <div className="bg-[#f4f2ed] min-h-screen">
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        newsCount={news.length}
        isLoading={isLoading}
      />
      <NewsGrid
        news={news}
        searchQuery={searchQuery}
        isLoading={isLoading}
        error={error}
        lang={language as "ru" | "uz" | "en" | "de"}
      />
    </div>
  );
}
