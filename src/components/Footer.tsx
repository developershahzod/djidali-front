import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();

  const _scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-white w-full min-h-[671px] lg:h-[671px]">
      <div className="relative max-w-[1440px] mx-auto h-full px-[20px] md:px-[50px] py-[30px] lg:py-0">
        {/* Contact with us */}
        <p
          className="lg:absolute lg:left-[50px] lg:top-[50px] font-medium text-[16px] md:text-[20px] leading-[normal] tracking-[-0.4px] text-[#333333] mb-3 lg:mb-0"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {translate({
            ru: "Связаться с нами",
            uz: "Biz bilan bog'lanish",
            en: "Contact us",
            de: "Kontaktiere uns",
          })}
        </p>

        {/* Phone */}
        <p
          className="lg:absolute lg:left-[50px] lg:top-[94px] font-medium text-[24px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333] mb-2 lg:mb-0"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          +998(94)470-88-44
        </p>

        {/* Email */}
        <p
          className="lg:absolute lg:left-[711px] lg:top-[94px] font-medium text-[24px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333] mb-8 lg:mb-0"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          hello@djidali.uz
        </p>

        {/* Site sections label */}
        <p
          className="lg:absolute lg:left-[50px] lg:top-[217px] font-medium text-[16px] md:text-[20px] leading-[normal] tracking-[-0.4px] text-[#333333] mb-4 lg:mb-0"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {translate({
            ru: "Разделы сайта",
            uz: "Sayt bo'limlari",
            en: "Site sections",
            de: "Website-Bereiche",
          })}
        </p>

        {/* Social networks label */}
        <p
          className="hidden lg:block lg:absolute lg:left-[1048px] lg:top-[217px] font-medium text-[20px] leading-[normal] tracking-[-0.4px] text-[#333333]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {translate({
            ru: "Социальные сети",
            uz: "Ijtimoiy tarmoqlar",
            en: "Social networks",
            de: "Soziale Netzwerke",
          })}
        </p>

        {/* Sections container */}
        <div className="lg:absolute lg:left-[50px] lg:top-[291px] grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-start gap-6 md:gap-8 lg:gap-[65px] mb-8 lg:mb-0">
          {/* О нас */}
          <div className="flex flex-col gap-[10px] w-full lg:w-[257px]">
            <p
              className="font-medium text-[20px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "О нас",
                uz: "Biz haqimizda",
                en: "About us",
                de: "Über uns",
              })}
            </p>
            <div className="flex flex-col gap-[8px]">
              <button
                onClick={() => navigate("/why-us")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Почему мы",
                  uz: "Nima uchun biz",
                  en: "Why us",
                  de: "Warum wir",
                })}
              </button>
              <button
                onClick={() => navigate("/news")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Новости",
                  uz: "Yangiliklar",
                  en: "News",
                  de: "Nachrichten",
                })}
              </button>
              <button
                onClick={() => navigate("/about#team")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Команда",
                  uz: "Jamoa",
                  en: "Team",
                  de: "Team",
                })}
              </button>
              <button
                onClick={() => navigate("/about#gallery")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Галерея",
                  uz: "Galereya",
                  en: "Gallery",
                  de: "Galerie",
                })}
              </button>
            </div>
          </div>

          {/* Виды туризма */}
          <div className="flex flex-col gap-[10px] w-full lg:w-[257px]">
            <p
              className="font-medium text-[20px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Виды туризма",
                uz: "Turizm turlari",
                en: "Tourism types",
                de: "Tourismus-Arten",
              })}
            </p>
            <div className="flex flex-col gap-[8px]">
              <button
                onClick={() => navigate("/category/ecotourism")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Экотуризм",
                  uz: "Ekoturizm",
                  en: "Ecotourism",
                  de: "Ökotourismus",
                })}
              </button>
              <button
                onClick={() => navigate("/category/agrotourism")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Агротуризм",
                  uz: "Agroturizm",
                  en: "Agrotourism",
                  de: "Agrotourismus",
                })}
              </button>
              <button
                onClick={() => navigate("/category/teambuilding")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Тимбилдинг",
                  uz: "Jamoa qurish",
                  en: "Team building",
                  de: "Teambuilding",
                })}
              </button>
              <button
                onClick={() => navigate("/category/sport-shooting")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Спортивная стрельба",
                  uz: "Sport otish",
                  en: "Sport shooting",
                  de: "Sportschießen",
                })}
              </button>
            </div>
          </div>

          {/* Наши туры */}
          <div className="flex flex-col gap-[10px] w-full lg:w-[257px]">
            <p
              className="font-medium text-[20px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Наши туры",
                uz: "Bizning turlar",
                en: "Our tours",
                de: "Unsere Touren",
              })}
            </p>
            <div className="flex flex-col gap-[8px]">
              <button
                onClick={() => navigate("/tours?type=individual")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Индивидуальные туры",
                  uz: "Individual turlar",
                  en: "Individual tours",
                  de: "Individuelle Touren",
                })}
              </button>
              <button
                onClick={() => navigate("/tours?type=group")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Групповые туры",
                  uz: "Guruh turlari",
                  en: "Group tours",
                  de: "Gruppentouren",
                })}
              </button>
              <button
                onClick={() => navigate("/tours?type=family")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Семейные туры",
                  uz: "Oilaviy turlar",
                  en: "Family tours",
                  de: "Familientouren",
                })}
              </button>
              <button
                onClick={() => navigate("/tours?type=corporate")}
                className="font-medium text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676] hover:text-[#333333] transition-colors text-left"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {translate({
                  ru: "Корпоративные туры",
                  uz: "Korporativ turlar",
                  en: "Corporate tours",
                  de: "Firmentouren",
                })}
              </button>
            </div>
          </div>
        </div>

        {/* Social networks */}
        <div className="mb-8 lg:mb-0">
          <p
            className="lg:hidden font-medium text-[16px] md:text-[20px] leading-[normal] tracking-[-0.4px] text-[#333333] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {translate({
              ru: "Социальные сети",
              uz: "Ijtimoiy tarmoqlar",
              en: "Social networks",
              de: "Soziale Netzwerke",
            })}
          </p>
          <div
            className="lg:absolute lg:left-[1048px] lg:top-[291px] flex flex-row lg:flex-col gap-4 lg:gap-[32px] font-medium text-[20px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8F7B49] transition-colors whitespace-nowrap"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8F7B49] transition-colors whitespace-nowrap"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8F7B49] transition-colors whitespace-nowrap"
            >
              Linkedin
            </a>
          </div>
        </div>

        {/* Our contacts link - bottom left */}
        <button
          onClick={() => navigate("/contact")}
          className="lg:absolute lg:left-[50px] lg:bottom-[80px] flex items-center gap-[12px] lg:gap-[20px] group mb-6 lg:mb-0"
        >
          <p
            className="font-medium text-[20px] md:text-[28px] lg:text-[35px] leading-[normal] tracking-[-0.7px] text-[#333333] group-hover:text-[#8F7B49] transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {translate({
              ru: "Наши контакты",
              uz: "Bizning kontaktlar",
              en: "Our contacts",
              de: "Unsere Kontakte",
            })}
          </p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="lg:w-[32px] lg:h-[32px] text-[#333333] group-hover:text-[#8F7B49] transition-colors"
          >
            <path
              d="M6.66669 16H25.3334"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.6667 9.33301L25.3334 16L18.6667 22.6663"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Copyright - centered */}
        <p
          className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-[25px] text-center font-medium text-[14px] md:text-[16px] leading-[28px] tracking-[-0.48px] text-[#767676]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          © 2025 DjidaliTravel
        </p>

        {/* Scroll to top button - bottom right */}
      </div>
    </footer>
  );
};

export default Footer;
