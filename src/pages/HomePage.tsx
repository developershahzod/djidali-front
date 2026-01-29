import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { useTours } from "../hooks/useTours";
import { getTourPrimaryImage } from "../utils/imageUtils";
import { useLanguage } from "../contexts/LanguageContext";
import ScrollToTopButton from "../components/ScrollToTopButton";

const aboutImages = ["/news-1.webp", "/news-2.webp"];

const aboutContent = [
  {
    title: { ru: "О нас", uz: "Biz haqimizda", en: "About us", de: "Über uns" },
    text1: {
      ru: "Мы помогаем вам найти ",
      uz: "Biz sizga topishga yordam beramiz ",
      en: "We help you find ",
      de: "Wir helfen Ihnen zu finden ",
    },
    highlight: {
      ru: "путешествие вашей мечты",
      uz: "orzuingizdagi sayohat",
      en: "your dream journey",
      de: "Ihre Traumreise",
    },
    text2: {
      ru: " и открыть красоту природы в её лучших проявлениях.",
      uz: " va tabiatning eng yaxshi ko'rinishlarida go'zalligini kashf eting.",
      en: " and discover the beauty of nature at its finest.",
      de: " und die Schönheit der Natur in ihrer besten Form entdecken.",
    },
    bottomText: {
      ru: "Дальверзин - уникальное пространство для Вашего отдыха в Узбекистане",
      uz: "Dalverzin - O'zbekistonda dam olishingiz uchun noyob makon",
      en: "Dalverzin - A unique space for your relaxation in Uzbekistan",
      de: "Dalverzin - Ein einzigartiger Ort für Ihre Erholung in Usbekistan",
    },
  },
  {
    title: {
      ru: "Высадка деревьев",
      uz: "Daraxt ekish",
      en: "Tree planting",
      de: "Baumpflanzung",
    },
    text1: {
      ru: "В рамках мероприятия на территории лесоохотничьего хозяйства произведена посадка ",
      uz: "Tadbir doirasida o'rmon-ov xo'jaligi hududida ",
      en: "During the event, ",
      de: "Im Rahmen der Veranstaltung wurden ",
    },
    highlight: {
      ru: "665 деревьев 11 различных видов",
      uz: "11 xil turdan 665 ta daraxt ekildi",
      en: "665 trees of 11 different species were planted",
      de: "665 Bäume von 11 verschiedenen Arten gepflanzt",
    },
    text2: {
      ru: ", а также высеяно 6 кг семян деревьев 3 видов.",
      uz: ", shuningdek 3 xil daraxt urug'laridan 6 kg ekildi.",
      en: ", and 6 kg of seeds of 3 tree species were sown.",
      de: ", und 6 kg Samen von 3 Baumarten wurden ausgesät.",
    },
    bottomText: {
      ru: "С учётом немецкого опыта",
      uz: "Nemis tajribasini hisobga olgan holda",
      en: "Based on German experience",
      de: "Unter Berücksichtigung deutscher Erfahrungen",
    },
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tours, loading, error, pagination } = useTours({ limit: 5 });
  const { t, language } = useLanguage();

  // Helper function to safely extract localized text from multilingual objects
  const getLocalizedText = (
    value: string | { [key: string]: string } | undefined | null,
    lang: string,
  ): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      const langKey = lang === "en" ? "eng" : lang;
      return value[langKey] || value.ru || value.eng || value.uz || "";
    }
    return "";
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Эффект для автоматического переключения слайдов
  useEffect(() => {
    const SLIDE_DURATION = 5000; // 5 секунд на слайд
    const PROGRESS_UPDATE_INTERVAL = 50; // мс
    const progressIncrement = (100 * PROGRESS_UPDATE_INTERVAL) / SLIDE_DURATION;

    // Интервал для прогресс-бара
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + progressIncrement;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    // Интервал для смены слайдов
    slideIntervalRef.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % aboutImages.length);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, []);

  return (
    <div className="bg-[#F5F1E6] text-[#2A241C]">
      <HeroSection />

      <section
        id="about"
        ref={sectionRef}
        className="relative bg-white py-0 overflow-hidden"
      >
        {/* Desktop & Tablet Layout */}
        <div className="hidden md:block relative h-[clamp(600px,62.5vw,900px)] w-full">
          {/* Background Image on the right - full width container */}
          <div className="absolute h-full right-0 top-0 w-[50vw] max-w-[720px]">
            <img
              src={aboutImages[activeImageIndex]}
              alt={t("home.about.imageAlt")}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ transition: "opacity 0.5s ease-in-out" }}
            />
          </div>

          {/* Content - centered with max-width */}
          <div className="relative h-full max-w-[min(1440px,100vw)] mx-auto">
            <div className="absolute flex flex-col gap-[clamp(12px,1.39vw,20px)] items-start left-[clamp(20px,3.47vw,50px)] top-[clamp(40px,5.56vw,80px)] w-[clamp(300px,37.5vw,540px)] text-[#333333]">
              <h2
                className="font-medium leading-[1] text-[clamp(32px,4.17vw,60px)] tracking-[-0.03em]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {aboutContent[activeImageIndex].title[language]}
              </h2>
              <p
                className="font-normal leading-[1.25] text-[clamp(18px,2.22vw,32px)] tracking-[-0.03em]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <span>{aboutContent[activeImageIndex].text1[language]}</span>
                <span className="text-[#8f7b49]">
                  {aboutContent[activeImageIndex].highlight[language]}
                </span>
                <span>{aboutContent[activeImageIndex].text2[language]}</span>
              </p>
            </div>

            {/* Icon */}
            <div className="absolute left-[clamp(12px,1.81vw,26px)] top-[clamp(350px,39.17vw,564px)] w-[clamp(80px,9.03vw,130px)] h-[clamp(80px,9.03vw,130px)]">
              <div className="relative w-full h-full">
                <div
                  className="absolute"
                  style={{ inset: "23.46% 22.77% 22.05% 18.19%" }}
                >
                  <img
                    src="/about-icon-group1.svg"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div
                  className="absolute"
                  style={{ inset: "23.46% 36.57% 22.83% 22.64%" }}
                >
                  <img
                    src="/about-icon-group2.svg"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <div
                  className="absolute"
                  style={{ inset: "21.7% 9.09% 41.62% 54.84%" }}
                >
                  <img
                    src="/about-icon-vector.svg"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <p
              className="absolute font-medium leading-[1.75] left-[clamp(20px,3.47vw,50px)] text-[#333333] text-[clamp(14px,1.11vw,16px)] top-[clamp(450px,48.75vw,702px)] tracking-[-0.03em] w-[clamp(280px,34.93vw,503px)]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {aboutContent[activeImageIndex].bottomText[language]}
            </p>

            {/* Pagination */}
            <div className="absolute left-[clamp(20px,3.47vw,50px)] bottom-[clamp(30px,3.47vw,50px)] w-[clamp(200px,26.39vw,380px)] h-[3px] flex gap-[clamp(6px,0.9vw,13px)]">
              {aboutImages.map((_, index) => (
                <div
                  key={index}
                  className="relative h-[3px] rounded-full flex-1"
                  style={{
                    background: "rgba(51, 51, 51, 0.1)",
                  }}
                >
                  {index === activeImageIndex && (
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: "#333333",
                        transition: "width 0.05s linear",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden relative">
          <div className="flex flex-col">
            {/* Content First */}
            <div className="px-6 py-12 text-[#333333]">
              <h2
                className="font-medium leading-[1.2] text-[32px] tracking-[-0.96px] mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {aboutContent[activeImageIndex].title[language]}
              </h2>
              <p
                className="font-normal leading-[1.4] text-[18px] tracking-[-0.54px] mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <span>{aboutContent[activeImageIndex].text1[language]}</span>
                <span className="text-[#8f7b49]">
                  {aboutContent[activeImageIndex].highlight[language]}
                </span>
                <span>{aboutContent[activeImageIndex].text2[language]}</span>
              </p>

              {/* Icon on mobile */}
              <div className="w-[80px] h-[80px] mb-6">
                <div className="relative w-full h-full">
                  <div
                    className="absolute"
                    style={{ inset: "23.46% 22.77% 22.05% 18.19%" }}
                  >
                    <img
                      src="/about-icon-group1.svg"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div
                    className="absolute"
                    style={{ inset: "23.46% 36.57% 22.83% 22.64%" }}
                  >
                    <img
                      src="/about-icon-group2.svg"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div
                    className="absolute"
                    style={{ inset: "21.7% 9.09% 41.62% 54.84%" }}
                  >
                    <img
                      src="/about-icon-vector.svg"
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <p
                className="font-medium leading-[1.75] text-[#333333] text-[14px] tracking-[-0.42px] mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {aboutContent[activeImageIndex].bottomText[language]}
              </p>

              {/* Pagination on mobile */}
              <div className="w-full max-w-[300px] h-[3px] flex gap-[8px]">
                {aboutImages.map((_, index) => (
                  <div
                    key={index}
                    className="relative h-[3px] rounded-full flex-1"
                    style={{
                      background: "rgba(51, 51, 51, 0.1)",
                    }}
                  >
                    {index === activeImageIndex && (
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: "#333333",
                          transition: "width 0.05s linear",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Below */}
            <div className="relative h-[400px] w-full">
              <img
                src={aboutImages[activeImageIndex]}
                alt={t("home.about.imageAlt")}
                className="w-full h-full object-cover object-center"
                style={{ transition: "opacity 0.5s ease-in-out" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="bg-[#F4F2ED] py-[clamp(40px,6.67vw,96px)]">
        <div className="max-w-[min(1440px,100vw)] mx-auto px-[clamp(20px,3.47vw,50px)]">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-[clamp(40px,6.94vw,100px)] gap-4">
            <h2
              className="font-medium leading-[1] text-[clamp(32px,4.17vw,60px)] tracking-[-0.03em] text-[#333333]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.popular.heading")}
            </h2>
            <p
              className="font-light leading-[1.4] text-[clamp(16px,1.39vw,20px)] tracking-[-0.02em] text-[#333333]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.popular.subtitle").replace(
                "{count}",
                String(pagination?.total || tours.length),
              )}
            </p>
          </div>

          <div className="flex flex-col gap-[20px]">
            {loading && (
              <div className="flex justify-center py-16">
                <span className="text-[#333333] text-base">
                  {t("home.popular.loading")}
                </span>
              </div>
            )}

            {error && !loading && (
              <div className="bg-[#FCE8E6] border border-[#F5B1A8] text-[#8C342A] rounded-[20px] px-8 py-6 text-center">
                {t("common.error")} • {error}
              </div>
            )}

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
                        {Number(tour.price || 0).toLocaleString("ru-RU")} UZS
                      </p>
                      <p className="font-medium leading-[1] text-[clamp(12px,1.11vw,16px)] tracking-[-0.02em]">
                        {t("home.popular.from")}
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
                          {t("home.popular.daysAndPeople")
                            .replace("{duration}", String(tour.duration || 0))
                            .replace(
                              "{people}",
                              String(tour.max_participants || 15),
                            )}
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
                            {Number(tour.price || 0).toLocaleString("ru-RU")}{" "}
                            UZS
                          </p>
                          <p className="font-medium leading-[1] text-[14px] tracking-[-0.28px]">
                            {t("home.popular.from")}
                          </p>
                        </div>

                        <div
                          className="flex flex-col gap-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <p className="font-medium leading-[1.4] text-[20px] tracking-[-0.4px]">
                            {t("home.popular.daysAndPeople")
                              .replace("{duration}", String(tour.duration || 0))
                              .replace(
                                "{people}",
                                String(tour.max_participants || 15),
                              )}
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

            {!loading && !error && tours.length === 0 && (
              <div className="rounded-[20px] bg-white/80 border-2 border-[silver] px-8 py-10 text-center text-[#333333]">
                {t("home.popular.emptyState")}
              </div>
            )}
          </div>

          <div className="mt-[clamp(40px,5.56vw,80px)] flex justify-center">
            <button
              className="w-full border-2 border-[silver] rounded-[20px] px-[clamp(24px,2.78vw,40px)] py-[clamp(16px,1.81vw,26px)] flex items-center justify-center font-normal leading-[1.2] text-[clamp(16px,1.39vw,20px)] tracking-[-0.02em] text-[#333333] hover:bg-white/70 transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
              onClick={() => navigate("/tours")}
            >
              {t("home.popular.viewAll")}
            </button>
          </div>
        </div>
      </section>

      <section id="why-us" className="w-full pt-0 pb-0">
        {/* Desktop Layout - Container with fixed height for bento grid */}
        <div className="relative w-full h-[clamp(1000px,111.11vw,1600px)] mx-auto hidden lg:block">
          {/* Main card "Почему мы" - Top Left */}
          <div
            onClick={() => navigate("/why-us")}
            className="absolute left-0 top-0 w-[50%] h-[clamp(280px,31.25vw,450px)] bg-[#8F7B49] cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl"
            aria-label="Why Us Section"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us");
              }
            }}
          >
            {/* Icon */}
            <div className="absolute left-[clamp(30px,3.47vw,50px)] top-[clamp(35px,4.17vw,60px)] w-[clamp(50px,5.56vw,80px)] h-[clamp(50px,5.56vw,80px)] bg-[#333333] rounded-[45px] flex items-center justify-center">
              <div className="relative w-[50%] h-[50%]">
                <img
                  src="/why-us-icon1.svg"
                  alt=""
                  className="absolute inset-0 w-full h-full"
                />
                <img
                  src="/why-us-icon2.svg"
                  alt=""
                  className="absolute"
                  style={{
                    top: "10%",
                    left: "12.5%",
                    width: "75%",
                    height: "82.5%",
                  }}
                />
              </div>
            </div>
            {/* Text content */}
            <div
              className="absolute left-[clamp(30px,3.47vw,50px)] top-[clamp(130px,15.28vw,220px)] w-[clamp(380px,42.71vw,615px)] flex flex-col gap-[clamp(12px,1.39vw,20px)] text-white font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <h2 className="text-[clamp(32px,4.17vw,60px)] leading-[1] tracking-[-0.03em]">
                {t("home.whyUs.mainTitle")}
              </h2>
              <p className="text-[clamp(14px,1.11vw,16px)] leading-[1.75] tracking-[-0.03em]">
                {t("home.whyUs.mainDescription")}
              </p>
            </div>
          </div>

          {/* Card "Знакомство с первозданной природой" - Middle Left */}
          <div
            onClick={() => navigate("/why-us#nature")}
            className="absolute left-0 top-[clamp(280px,31.25vw,450px)] w-[50%] h-[clamp(280px,31.25vw,450px)] overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl"
            style={{
              backgroundImage: "url(/why-us-nature-new.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#nature");
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-[clamp(30px,3.47vw,50px)] top-[clamp(35px,4.17vw,60px)] w-[clamp(320px,37.5vw,540px)] text-white text-[clamp(24px,2.78vw,40px)] leading-[1.2] tracking-[-0.02em] font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.nature")}
            </p>
          </div>

          {/* Card "Комфортное проживание" - Bottom Left */}
          <div
            onClick={() => navigate("/why-us#comfort")}
            className="absolute left-0 top-[clamp(560px,62.5vw,900px)] w-[48.96%] h-[clamp(440px,48.61vw,700px)] overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl"
            style={{
              backgroundImage: "url(/why-us-comfort-new.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#comfort");
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-[clamp(30px,3.47vw,50px)] top-[clamp(35px,4.17vw,60px)] w-[clamp(310px,36.6vw,527px)] text-white text-[clamp(24px,2.78vw,40px)] leading-[1.2] tracking-[-0.02em] font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.comfort")}
            </p>
          </div>

          {/* Card "Команда специалистов" - Top Right */}
          <div
            onClick={() => navigate("/why-us#team")}
            className="absolute right-0 top-0 w-[51.04%] h-[clamp(560px,62.5vw,900px)] overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl"
            style={{
              backgroundImage: "url(/10.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#team");
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-[clamp(30px,3.47vw,50px)] top-[clamp(35px,4.17vw,60px)] w-[clamp(240px,27.57vw,397px)] text-white text-[clamp(24px,2.78vw,40px)] leading-[1.2] tracking-[-0.02em] font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.team")}
            </p>
          </div>

          {/* Card "Уникальные маршруты" - Bottom Right */}
          <div
            onClick={() => navigate("/why-us#routes")}
            className="absolute right-0 top-[clamp(560px,62.5vw,900px)] w-[51.04%] h-[clamp(440px,48.61vw,700px)] overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl"
            style={{
              backgroundImage: "url(/why-us-routes-new.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#routes");
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-[clamp(30px,3.47vw,50px)] top-[clamp(35px,4.17vw,60px)] w-[clamp(240px,27.71vw,399px)] text-white text-[clamp(24px,2.78vw,40px)] leading-[1.2] tracking-[-0.02em] font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.routes")}
            </p>
          </div>
        </div>

        {/* Mobile version - Stack vertically */}
        <div className="flex flex-col gap-6 lg:hidden">
          {/* Main card */}
          <div
            onClick={() => navigate("/why-us")}
            className="w-full min-h-[400px] bg-[#8F7B49] rounded-[20px] p-8 cursor-pointer transition-all duration-300 hover:brightness-110 hover:shadow-2xl active:scale-98"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us");
              }
            }}
          >
            <div className="w-[80px] h-[80px] bg-[#333333] rounded-[45px] flex items-center justify-center mb-8">
              <div className="relative w-[40px] h-[40px]">
                <img
                  src="/why-us-icon1.svg"
                  alt=""
                  className="absolute inset-0 w-full h-full"
                />
                <img
                  src="/why-us-icon2.svg"
                  alt=""
                  className="absolute"
                  style={{
                    top: "10%",
                    left: "12.5%",
                    width: "75%",
                    height: "82.5%",
                  }}
                />
              </div>
            </div>
            <h2
              className="text-white text-[40px] leading-[48px] tracking-[-1.2px] font-medium mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.whyUs.mainTitle")}
            </h2>
            <p
              className="text-white text-[16px] leading-[28px] tracking-[-0.48px] font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.whyUs.mainDescription")}
            </p>
          </div>

          {/* Image cards */}
          <div
            onClick={() => navigate("/why-us#nature")}
            className="relative w-full h-[400px] rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 active:scale-98"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#nature");
              }
            }}
          >
            <img
              src="/why-us-nature-new.webp"
              alt={t("home.experience.nature")}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-8 top-8 text-white text-[32px] leading-[40px] tracking-[-0.64px] font-medium max-w-[80%]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.nature")}
            </p>
          </div>

          <div
            onClick={() => navigate("/why-us#team")}
            className="relative w-full h-[400px] rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 active:scale-98"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#team");
              }
            }}
          >
            <img
              src="/10.webp"
              alt={t("home.experience.team")}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-8 top-8 text-white text-[32px] leading-[40px] tracking-[-0.64px] font-medium max-w-[80%]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.team")}
            </p>
          </div>

          <div
            onClick={() => navigate("/why-us#comfort")}
            className="relative w-full h-[400px] rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 active:scale-98"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#comfort");
              }
            }}
          >
            <img
              src="/why-us-comfort-new.webp"
              alt={t("home.experience.comfort")}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-8 top-8 text-white text-[32px] leading-[40px] tracking-[-0.64px] font-medium max-w-[80%]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.comfort")}
            </p>
          </div>

          <div
            onClick={() => navigate("/why-us#routes")}
            className="relative w-full h-[400px] rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 active:scale-98"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/why-us#routes");
              }
            }}
          >
            <img
              src="/why-us-routes-new.webp"
              alt={t("home.experience.routes")}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.45)] to-transparent"></div>
            <p
              className="absolute left-8 top-8 text-white text-[32px] leading-[40px] tracking-[-0.64px] font-medium max-w-[80%]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {t("home.experience.routes")}
            </p>
          </div>
        </div>
      </section>
      <ScrollToTopButton />
    </div>
  );
};

interface ExperienceCardProps {
  id: string;
  title?: string;
  image?: string;
  type?: "text";
}

const _ExperienceCard: React.FC<ExperienceCardProps> = ({
  type,
  title,
  image,
}) => {
  if (type === "text") {
    return null;
  }

  return (
    <div className="relative rounded-[32px] overflow-hidden min-h-[320px]">
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <div className="relative z-10 h-full flex items-end">
        <div className="p-10">
          <h3 className="text-white text-[1.9rem] leading-tight font-light max-w-xs">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
