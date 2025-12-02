import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { apiService, News } from "../services/api";

// Import images
const placeholderImage = "../public/about-hero.webp";
const similarNewsImage =
  "../public/fcd4ea8bf176e4851a46f14de3020f62faed656d (1).jpg";

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

// Hero Section with Back Button
interface HeroSectionProps {
  title: string;
  backgroundImage: string;
  onBack: () => void;
  isLoading?: boolean;
}

function HeroSection({
  title,
  backgroundImage,
  onBack,
  isLoading,
}: HeroSectionProps) {
  const { translate } = useLanguage();

  return (
    <div className="relative h-[400px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        ) : (
          <img
            alt=""
            className="absolute object-cover size-full"
            src={backgroundImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderImage;
            }}
          />
        )}
        <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute left-[20px] md:left-[50px] top-[100px] md:top-[138px] z-20 flex items-center gap-[8px] text-white hover:text-white/80 transition-colors group"
      >
        <div className="flex items-center justify-center size-[24px]">
          <svg
            className="block size-full rotate-90"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[16px] md:text-[20px] tracking-[-0.4px]">
          {translate({ ru: "Назад", uz: "Orqaga", en: "Back", de: "Zurück" })}
        </p>
      </button>

      {/* Title */}
      {isLoading ? (
        <div className="absolute left-[20px] md:left-[50px] right-[20px] top-[200px] md:top-[350px] lg:top-[450px]">
          <div className="h-12 md:h-20 bg-white/20 rounded animate-pulse w-3/4" />
        </div>
      ) : (
        <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[40px] md:leading-[60px] lg:leading-[100px] left-[20px] md:left-[50px] right-[20px] md:right-auto text-[32px] md:text-[60px] lg:text-[90px] text-white top-[200px] md:top-[350px] lg:top-[450px] tracking-[-1.2px] md:tracking-[-2px] lg:tracking-[-2.7px] max-w-[calc(100%-40px)] md:w-[900px] lg:w-[1340px]">
          {title}
        </p>
      )}

      {/* Decorative line */}
      <div className="hidden md:block absolute h-0 left-[80px] md:left-[120px] top-[550px] md:top-[617px] w-[60px] md:w-[100px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-6px]">
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
    </div>
  );
}

// Loading Skeleton for Content
function ContentSkeleton() {
  return (
    <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] pt-10 md:pt-20 pb-10 md:pb-16">
      <div className="flex flex-col gap-[60px] items-start w-full">
        <div className="w-full space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
        <div className="h-[300px] md:h-[500px] w-full bg-gray-200 rounded-[20px] animate-pulse" />
        <div className="w-full space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { translate, language } = useLanguage();

  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch news item
  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Try to fetch by slug first
        const news = await apiService.getNewsBySlug(id, apiLang);
        setNewsItem(news);

        // Fetch related news
        const allNews = await apiService.getNews({ lang: apiLang, limit: 10 });
        const related = (allNews.data || [])
          .filter((item) => item.id !== news.id)
          .slice(0, 3);
        setRelatedNews(related);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(err instanceof Error ? err.message : "Failed to load news");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [id, apiLang]);

  const handleBack = () => {
    navigate("/news");
  };

  // Error state
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333] text-[32px] mb-4">
            {translate({
              ru: "Новость не найдена",
              uz: "Yangilik topilmadi",
              en: "News not found",
              de: "Nachricht nicht gefunden",
            })}
          </h1>
          <p className="text-[#666] mb-6">{error}</p>
          <button
            onClick={() => navigate("/news")}
            className="bg-[#8f7b49] hover:bg-[#7a6839] text-white px-8 py-3 rounded-full font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] uppercase transition-all duration-200"
          >
            {translate({
              ru: "Вернуться к новостям",
              uz: "Yangiliklarга qaytish",
              en: "Back to news",
              de: "Zurück zu den Nachrichten",
            })}
          </button>
        </div>
      </div>
    );
  }

  const title = newsItem
    ? getLocalizedField(
        newsItem,
        "title",
        language as "ru" | "uz" | "en" | "de",
      )
    : "";
  const content = newsItem
    ? getLocalizedField(
        newsItem,
        "content",
        language as "ru" | "uz" | "en" | "de",
      )
    : "";

  // Build image URL
  const coverImage = newsItem?.coverImage
    ? newsItem.coverImage.startsWith("http")
      ? newsItem.coverImage
      : `${import.meta.env.VITE_IMAGE_BASE_URL}${newsItem.coverImage}`
    : placeholderImage;

  // Get additional images
  const additionalImages = newsItem?.images || [];

  return (
    <div className="bg-[#f4f2ed] min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={title}
        backgroundImage={coverImage}
        onBack={handleBack}
        isLoading={isLoading}
      />

      {/* Main Content */}
      {isLoading ? (
        <ContentSkeleton />
      ) : (
        newsItem && (
          <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] pt-10 md:pt-20 pb-10 md:pb-16">
            <div className="flex flex-col gap-[60px] items-start w-full">
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 items-center text-[#666]">
                {newsItem.publishedAt && (
                  <span className="text-sm">
                    {new Date(newsItem.publishedAt).toLocaleDateString(
                      language === "en"
                        ? "en-US"
                        : language === "de"
                          ? "de-DE"
                          : language === "uz"
                            ? "uz-UZ"
                            : "ru-RU",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </span>
                )}
                {newsItem.isFeatured && (
                  <span className="bg-[#8f7b49] text-white text-xs px-3 py-1 rounded-full">
                    {translate({
                      ru: "Избранное",
                      uz: "Tanlangan",
                      en: "Featured",
                      de: "Empfohlen",
                    })}
                  </span>
                )}
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none w-full
                prose-headings:font-['Montserrat:Medium',sans-serif] prose-headings:text-[#333333]
                prose-p:font-['Montserrat:Regular',sans-serif] prose-p:text-[#333333] prose-p:leading-[1.8]
                prose-img:rounded-[20px] prose-img:w-full
                prose-a:text-[#8f7b49] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Additional Images Gallery */}
              {additionalImages.length > 0 && (
                <div className="w-full">
                  <h3 className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[24px] md:text-[32px] mb-6">
                    {translate({
                      ru: "Галерея",
                      uz: "Galereya",
                      en: "Gallery",
                      de: "Galerie",
                    })}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {additionalImages.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-video rounded-[10px] md:rounded-[20px] overflow-hidden"
                      >
                        <img
                          src={
                            img.startsWith("http")
                              ? img
                              : `${import.meta.env.VITE_IMAGE_BASE_URL}${img}`
                          }
                          alt={`${title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {newsItem.tags && newsItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-[#666] text-sm px-4 py-2 rounded-full border border-[#e0e0e0]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] py-10 md:py-16">
          <h2 className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[32px] md:text-[48px] lg:text-[60px] tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-1.8px] mb-8 md:mb-12">
            {translate({
              ru: "Похожие новости",
              uz: "O'xshash yangiliklar",
              en: "Related news",
              de: "Ähnliche Nachrichten",
            })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-4 md:gap-6">
            {/* Featured Promotional Card */}
            <Link
              to="/tours"
              className="relative h-[400px] md:h-[540px] rounded-[20px] overflow-hidden group cursor-pointer"
            >
              <img
                alt="Путешествовать"
                className="absolute inset-0 object-cover size-full transition-transform duration-500 group-hover:scale-110"
                src={similarNewsImage}
              />
              <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[20px]" />
              <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-between">
                <p className="font-['Montserrat:Medium',sans-serif] font-medium text-white text-[14px] md:text-[16px] tracking-[-0.48px]">
                  {translate({
                    ru: "Путешествовать",
                    uz: "Sayohat qilish",
                    en: "Travel",
                    de: "Reisen",
                  })}
                </p>
                <div>
                  <p className="font-['Montserrat:Regular',sans-serif] text-white text-[28px] md:text-[45px] leading-[1.3] md:leading-[60px] tracking-[-0.8px] md:tracking-[-1.35px]">
                    {translate({
                      ru: "Мы поможем вам",
                      uz: "Biz sizga yordam beramiz",
                      en: "We will help you",
                      de: "Wir helfen Ihnen",
                    })}
                    <br />
                    {translate({
                      ru: "найти ",
                      uz: "topishga ",
                      en: "find ",
                      de: "finden ",
                    })}
                    <span className="font-['Montserrat:SemiBold',sans-serif] font-semibold">
                      {translate({
                        ru: "свою мечту",
                        uz: "o'z orzuingizni",
                        en: "your dream",
                        de: "Ihren Traum",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </Link>

            {/* Related News Cards */}
            {relatedNews.slice(0, 2).map((item) => {
              const itemTitle = getLocalizedField(
                item,
                "title",
                language as "ru" | "uz" | "en" | "de",
              );
              const itemExcerpt =
                getLocalizedField(
                  item,
                  "excerpt",
                  language as "ru" | "uz" | "en" | "de",
                ) ||
                getLocalizedField(
                  item,
                  "content",
                  language as "ru" | "uz" | "en" | "de",
                ).substring(0, 150);
              const itemImage = item.coverImage
                ? item.coverImage.startsWith("http")
                  ? item.coverImage
                  : `${import.meta.env.VITE_IMAGE_BASE_URL}${item.coverImage}`
                : placeholderImage;

              return (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="flex flex-col gap-[20px] group"
                >
                  <div className="h-[200px] md:h-[285px] relative rounded-[20px] overflow-hidden">
                    <img
                      alt={itemTitle}
                      className="absolute inset-0 object-cover rounded-[20px] size-full transition-transform duration-500 group-hover:scale-110"
                      src={itemImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage;
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333333] text-[18px] md:text-[22px] tracking-[-0.44px] group-hover:text-[#8f7b49] transition-colors line-clamp-2">
                      {itemTitle}
                    </p>
                    <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[#5c5c5c] text-[14px] md:text-[16px] tracking-[-0.48px] line-clamp-2">
                      {itemExcerpt.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
