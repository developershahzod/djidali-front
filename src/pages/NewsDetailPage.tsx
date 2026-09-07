import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLocalizedNewsData } from "./NewsPage";
import { svgPaths } from "../utils/svgPaths";
import { useLanguage } from "../contexts/LanguageContext";
import api, { News } from "../services/api";
import { getImageUrl } from "../utils/imageUtils";
import { SafeHTML } from "../components/SafeHTML";

// Navigation Components (reused from NewsPage)
function Group() {
  return (
    <div className="absolute inset-[5%_13.95%_5%_15%]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 39 49"
      >
        <g>
          <path
            clipRule="evenodd"
            d={svgPaths.p108d200}
            fill="white"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d={svgPaths.pa388e00}
            fill="white"
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[54px]">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g clipPath="url(#clip0_1_216)">
          <path d={svgPaths.p12c5be40} fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_1_216">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[14px] text-nowrap text-white uppercase whitespace-pre">
        РУ
      </p>
      <Frame />
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[100px]"
      />
      <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[14px] text-nowrap text-white uppercase whitespace-pre">
        Забронировать
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-end relative shrink-0">
      <Frame5 />
      <Button />
    </div>
  );
}

function NavItem({
  label,
  isActive = false,
}: {
  label: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={`box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[12px] relative rounded-[100px] shrink-0 ${isActive ? "bg-[rgba(255,255,255,0.4)]" : ""}`}
    >
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[14px] text-nowrap text-white uppercase whitespace-pre">
        {label}
      </p>
    </div>
  );
}

function NavItems() {
  return (
    <div className="absolute content-stretch flex items-center left-[calc(50%+0.5px)] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <NavItem label="О нас" />
      <NavItem label="Виды туризма" />
      <NavItem label="Наши туры" />
      <NavItem label="Новости" isActive />
      <NavItem label="Контакты" />
    </div>
  );
}

function NavContent() {
  return (
    <div className="backdrop-blur-sm backdrop-filter basis-0 bg-[rgba(255,255,255,0.1)] grow max-w-[1680px] min-h-px min-w-px relative rounded-[16px] shrink-0">
      <div className="flex flex-row items-center max-w-inherit size-full">
        <div className="box-border content-stretch flex items-center justify-between max-w-inherit px-[32px] py-[12px] relative w-full">
          <Logo />
          <Frame4 />
          <NavItems />
        </div>
      </div>
    </div>
  );
}

function _Nav() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-0 pb-0 pt-[20px] px-[20px] md:px-[50px] right-0 top-0">
      <NavContent />
    </div>
  );
}

// Hero Section with Back Button
interface HeroSectionProps {
  title: string;
  backgroundImage: string;
  onBack: () => void;
}

function HeroSection({ title, backgroundImage, onBack }: HeroSectionProps) {
  const { translate } = useLanguage();

  return (
    <div className="relative h-[400px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <img
          alt=""
          className="absolute object-cover object-top size-full"
          src={backgroundImage}
        />
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
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[40px] md:leading-[65px] lg:leading-[100px] left-[20px] md:left-[50px] right-[20px] md:right-[50px] text-[32px] md:text-[55px] lg:text-[80px] text-white bottom-[80px] md:bottom-[100px] lg:bottom-[120px] tracking-[-1.2px] md:tracking-[-2px] lg:tracking-[-2.4px]">
        {title}
      </p>
    </div>
  );
}

// Footer Components
function AboutLinks() {
  return (
    <div className="content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[8px] items-start leading-[28px] relative shrink-0 text-[#767676] text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
      <p className="relative shrink-0">Почему мы</p>
      <p className="relative shrink-0">Интересное</p>
      <p className="relative shrink-0">Команда</p>
      <p className="relative shrink-0">Галерея</p>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[257px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[35px] tracking-[-0.7px] w-[min-content]">
        О нас
      </p>
      <AboutLinks />
    </div>
  );
}

function TourismTypesLinks() {
  return (
    <div className="content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[8px] items-start leading-[28px] relative shrink-0 text-[#767676] text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
      <p className="relative shrink-0">Экотуризм</p>
      <p className="relative shrink-0">Агротуризм</p>
      <p className="relative shrink-0">Тимбилдинг</p>
      <p className="relative shrink-0">Спортивная стрельба</p>
    </div>
  );
}

function TourismTypesSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[257px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[35px] tracking-[-0.7px] w-[min-content]">
        Виды туризма
      </p>
      <TourismTypesLinks />
    </div>
  );
}

function OurToursLinks() {
  return (
    <div className="content-stretch flex flex-col font-['Montserrat:Medium',sans-serif] font-medium gap-[8px] items-start leading-[28px] relative shrink-0 text-[#767676] text-[16px] text-nowrap tracking-[-0.48px] whitespace-pre">
      <p className="relative shrink-0">Индивидуальные туры</p>
      <p className="relative shrink-0">Групповые туры</p>
      <p className="relative shrink-0">Семейные туры</p>
      <p className="relative shrink-0">Корпоративные туры</p>
    </div>
  );
}

function OurToursSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[257px]">
      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#333333] text-[35px] text-nowrap tracking-[-0.7px] whitespace-pre">
        Наши туры
      </p>
      <OurToursLinks />
    </div>
  );
}

function ArrowIcon() {
  return (
    <div className="relative shrink-0 size-[32px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g clipPath="url(#clip0_1_220)">
          <path d={svgPaths.p1dbe4b80} fill="#333333" />
        </g>
        <defs>
          <clipPath id="clip0_1_220">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function _Footer() {
  return (
    <footer className="bg-white w-full py-16 px-[50px] mt-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Contact Section */}
        <div className="mb-16">
          <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px] mb-8">
            Связаться с нами
          </p>
          <div className="flex gap-16">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[35px] tracking-[-0.7px]">
              +998 00 000 00 00
            </p>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[35px] tracking-[-0.7px]">
              travel@djidali.land
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          <div>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px] mb-6">
              Разделы сайта
            </p>
            <AboutSection />
          </div>
          <div>
            <TourismTypesSection />
          </div>
          <div>
            <OurToursSection />
          </div>
          <div>
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[20px] tracking-[-0.4px] mb-6">
              Социальные сети
            </p>
            <div className="flex flex-col gap-8 text-[#333333] text-[35px] tracking-[-0.7px]">
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Facebook
              </p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Instagram
              </p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Linkedin
              </p>
              <p className="font-['Montserrat:Medium',sans-serif] font-medium">
                Twitter
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-8 border-t border-[#e0e0e0]">
          <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#767676] text-[16px] tracking-[-0.48px]">
            © 2026 DjidaliTravel
          </p>
          <div className="flex gap-4 items-center cursor-pointer hover:text-[#8f7b49] transition-colors">
            <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[35px] tracking-[-0.7px]">
              Наши контакты
            </p>
            <ArrowIcon />
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper to get localized field from News
const getNewsLocalizedField = (
  news: News,
  field: "title" | "content" | "excerpt",
  language: string,
): string => {
  // If API returned localized field directly
  if (field === "title" && news.title) return news.title;
  if (field === "content" && news.content) return news.content;
  if (field === "excerpt" && news.excerpt) return news.excerpt;

  // Fallback to specific language fields
  const langSuffix =
    language === "en"
      ? "Eng"
      : language.charAt(0).toUpperCase() + language.slice(1);
  const fieldKey = `${field}${langSuffix}` as keyof News;
  const value = news[fieldKey];
  if (value && typeof value === "string") return value;

  // Fallback chain
  const fallbacks = ["Ru", "Uz", "Eng", "De"];
  for (const fb of fallbacks) {
    const fbKey = `${field}${fb}` as keyof News;
    const fbValue = news[fbKey];
    if (fbValue && typeof fbValue === "string") return fbValue;
  }

  return "";
};

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { translate, language } = useLanguage();

  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Load news from API
  useEffect(() => {
    const loadNews = async () => {
      if (!id) return;

      setLoading(true);
      setError(false);

      try {
        const langParam = language === "en" ? "eng" : language;

        // Try to load by slug first, then by id
        let news: News;
        try {
          news = await api.getNewsBySlug(
            id,
            langParam as "uz" | "ru" | "eng" | "de",
          );
        } catch {
          // If slug fails, try by id (for backward compatibility)
          news = await api.getNewsById(
            id,
            langParam as "uz" | "ru" | "eng" | "de",
          );
        }

        setNewsItem(news);

        // Load related news (latest 3, excluding current)
        const response = await api.getNews({
          page: 1,
          limit: 4,
          lang: langParam as "uz" | "ru" | "eng" | "de",
        });
        setRelatedNews(
          response.data.filter((item) => item.id !== news.id).slice(0, 3),
        );
      } catch (err) {
        console.error("Failed to load news:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [id, language]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8f7b49]"></div>
      </div>
    );
  }

  // Error or not found state
  if (error || !newsItem) {
    // Fallback to static data
    const staticNews = getLocalizedNewsData(language);
    const staticItem = staticNews.find(
      (item) => item.id === Number(id) || String(item.id) === id,
    );

    if (!staticItem) {
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
  }

  const handleBack = () => {
    navigate("/news");
  };

  // Get display data from API news item
  const title = newsItem
    ? getNewsLocalizedField(newsItem, "title", language)
    : "";
  const content = newsItem
    ? getNewsLocalizedField(newsItem, "content", language)
    : "";
  const excerpt = newsItem
    ? getNewsLocalizedField(newsItem, "excerpt", language)
    : "";
  const coverImage = newsItem?.coverImage
    ? getImageUrl(newsItem.coverImage)
    : "/news-1.webp";

  return (
    <div className="bg-[#f4f2ed] min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={title}
        backgroundImage={coverImage}
        onBack={handleBack}
      />

      {/* Main Content */}
      <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] pt-10 md:pt-20 pb-10 md:pb-16">
        <div className="flex flex-col gap-[60px] items-start w-full">
          {/* Title and Excerpt */}
          <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 text-[#333333] w-full">
            <h1 className="font-['Montserrat:Medium',sans-serif] font-medium leading-[32px] md:leading-[48px] lg:leading-[60px] relative shrink-0 text-[28px] md:text-[48px] lg:text-[60px] tracking-[-0.9px] md:tracking-[-1.5px] lg:tracking-[-1.8px] w-full">
              {title}
            </h1>
            {excerpt && (
              <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[24px] md:leading-[32px] lg:leading-[40px] relative shrink-0 text-[16px] md:text-[20px] lg:text-[24px] tracking-[-0.32px] md:tracking-[-0.4px] lg:tracking-[-0.48px] w-full text-[#5c5c5c]">
                {excerpt}
              </p>
            )}
          </div>

          {/* Main Content - rendered safely with DOMPurify */}
          {content && (
            <SafeHTML
              html={content}
              className="prose prose-lg max-w-none w-full text-[#333333] font-['Montserrat:Regular',sans-serif]
                [&_h1]:text-[32px] [&_h1]:font-medium [&_h1]:mb-6 [&_h1]:mt-8
                [&_h2]:text-[28px] [&_h2]:font-medium [&_h2]:mb-5 [&_h2]:mt-7
                [&_h3]:text-[24px] [&_h3]:font-medium [&_h3]:mb-4 [&_h3]:mt-6
                [&_p]:text-[16px] md:[&_p]:text-[18px] lg:[&_p]:text-[20px] [&_p]:leading-[1.8] [&_p]:mb-6
                [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:mb-6 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_ol]:space-y-2
                [&_li]:text-[16px] md:[&_li]:text-[18px] lg:[&_li]:text-[20px] [&_li]:leading-[1.8]
                [&_img]:rounded-lg [&_img]:my-6
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#8f7b49] [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-[#f9f7f3]
                [&_a]:text-[#8f7b49] [&_a]:underline
                [&_hr]:my-8 [&_hr]:border-[#e0e0e0]
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            />
          )}

          {/* Additional Images from API */}
          {newsItem?.images && newsItem.images.length > 0 && (
            <div className="content-stretch flex flex-col md:flex-row items-center gap-2 relative shrink-0 w-full">
              {newsItem.images.slice(0, 2).map((img, index) => (
                <div
                  key={index}
                  className={`w-full md:basis-0 md:grow h-[300px] md:h-[400px] lg:h-[586px] min-h-px min-w-px relative shrink-0 ${
                    index === 0
                      ? "rounded-[10px] md:rounded-bl-[20px] md:rounded-tl-[20px] md:rounded-tr-[0px] md:rounded-br-[0px]"
                      : "rounded-[10px] md:rounded-br-[20px] md:rounded-tr-[20px] md:rounded-tl-[0px] md:rounded-bl-[0px]"
                  }`}
                >
                  <img
                    alt=""
                    className={`absolute inset-0 object-cover size-full ${
                      index === 0
                        ? "rounded-[10px] md:rounded-bl-[20px] md:rounded-tl-[20px] md:rounded-tr-[0px] md:rounded-br-[0px]"
                        : "rounded-[10px] md:rounded-br-[20px] md:rounded-tr-[20px] md:rounded-tl-[0px] md:rounded-bl-[0px]"
                    }`}
                    src={getImageUrl(img)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related News Section */}
      <div className="max-w-[1340px] mx-auto px-[20px] md:px-[50px] py-10 md:py-16">
        <h2 className="font-['Montserrat:Medium',sans-serif] font-medium text-[#333333] text-[32px] md:text-[48px] lg:text-[60px] tracking-[-1px] md:tracking-[-1.5px] lg:tracking-[-1.8px] mb-8 md:mb-12">
          {translate({
            ru: "Похожие новости",
            uz: "O'xshash yangiliklar",
            en: "Similar news",
            de: "Ähnliche Nachrichten",
          })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Related News Cards */}
          {relatedNews.slice(0, 3).map((item) => {
            const itemTitle = getNewsLocalizedField(item, "title", language);
            const itemExcerpt = getNewsLocalizedField(
              item,
              "excerpt",
              language,
            );
            const itemImage = item.coverImage
              ? getImageUrl(item.coverImage)
              : "/news-1.webp";

            return (
              <Link
                key={item.id}
                to={`/news/${item.slug || item.id}`}
                className="flex flex-col gap-[20px] group"
              >
                <div className="h-[285px] relative rounded-[20px] overflow-hidden">
                  <img
                    alt={itemTitle}
                    className="absolute inset-0 object-cover rounded-[20px] size-full transition-transform duration-500 group-hover:scale-110"
                    src={itemImage}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[#333333] text-[22px] tracking-[-0.44px] group-hover:text-[#8f7b49] transition-colors">
                    {itemTitle}
                  </p>
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[#5c5c5c] text-[16px] tracking-[-0.48px] line-clamp-2">
                    {itemExcerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
