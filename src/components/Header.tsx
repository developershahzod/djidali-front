import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { language, setLanguage, translate } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [_isOnLightBackground, _setIsOnLightBackground] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const languageOptions: Array<{
    value: "ru" | "uz" | "en" | "de";
    label: string;
  }> = useMemo(
    () => [
      { value: "ru", label: "RU" },
      { value: "uz", label: "UZ" },
      { value: "en", label: "EN" },
      { value: "de", label: "DE" },
    ],
    [],
  );

  // Detect background brightness
  useEffect(() => {
    const checkBackgroundBrightness = () => {
      if (!headerRef.current) return;

      const headerRect = headerRef.current.getBoundingClientRect();
      const centerX = headerRect.left + headerRect.width / 2;
      const centerY = headerRect.top + headerRect.height / 2;

      const element = document.elementFromPoint(centerX, centerY);
      if (
        !element ||
        element === headerRef.current ||
        headerRef.current.contains(element)
      ) {
        return;
      }

      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;

      const rgb = bgColor.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        setIsOnLightBackground(brightness > 128);
      }
    };

    checkBackgroundBrightness();

    const handleScroll = () => {
      requestAnimationFrame(checkBackgroundBrightness);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: "ru" | "uz" | "en" | "de") => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const dashboardLink =
    user?.role === "ADMIN" || user?.role === "SALES_MANAGER"
      ? "/admin"
      : "/dashboard";

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 pt-4 px-4"
      >
        <div className="backdrop-blur-sm bg-[rgba(51,51,51,0.1)] rounded-[16px] px-[32px] py-[12px] shadow-lg max-w-[1440px] mx-auto flex justify-between items-center text-white">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex flex-col gap-[6px] w-[24px] h-[24px] justify-center"
            aria-label="Open menu"
          >
            <span className="w-full h-[2px] bg-white rounded"></span>
            <span className="w-full h-[2px] bg-white rounded"></span>
            <span className="w-full h-[2px] bg-white rounded"></span>
          </button>

          <div onClick={handleLogoClick} className="cursor-pointer">
            <img
              src="/loho_white_png.webp"
              alt="DJIDALI"
              className="h-[36px] w-auto md:h-[54px] md:w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>

          <nav className="hidden lg:flex items-center gap-[4px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => navigate("/about")}
              className="text-white hover:text-white hover:bg-white/10 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "О нас",
                uz: "Biz haqimizda",
                en: "About",
                de: "Über uns",
              })}
            </button>
            <button
              onClick={() => navigate("/tourism-types")}
              className="text-white hover:text-white hover:bg-white/10 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Виды туризма",
                uz: "Turizm turlari",
                en: "Tourism Types",
                de: "Tourismusarten",
              })}
            </button>
            <button
              onClick={() => navigate("/tours")}
              className="text-white hover:text-white hover:bg-white/10 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Наши туры",
                uz: "Bizning turlarimiz",
                en: "Our Tours",
                de: "Unsere Touren",
              })}
            </button>
            <button
              onClick={() => navigate("/news")}
              className="text-white hover:text-white hover:bg-white/10 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Новости",
                uz: "Yangiliklar",
                en: "News",
                de: "Nachrichten",
              })}
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-white hover:text-white hover:bg-white/10 transition-all text-[14px] font-medium px-[16px] py-[12px] rounded-[100px] uppercase"
            >
              {translate({
                ru: "Контакты",
                uz: "Aloqa",
                en: "Contact",
                de: "Kontakt",
              })}
            </button>
          </nav>

          <div className="flex items-center gap-[16px] lg:gap-[32px] flex-shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                }
                className="flex items-center gap-[4px] text-white hover:text-white/80 transition-all"
              >
                <span className="text-[14px] font-medium uppercase leading-[16px]">
                  {languageOptions.find((opt) => opt.value === language)?.label}
                </span>
                <img
                  src="/language-dropdown-arrow.svg"
                  alt=""
                  className="w-[20px] h-[20px]"
                />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden min-w-[80px]">
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleLanguageChange(option.value)}
                      className={`w-full px-4 py-2.5 text-left text-[14px] font-medium uppercase transition-all ${
                        language === option.value
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-[8px]">
                <Link
                  to={dashboardLink}
                  className="text-white bg-white/10 border border-white hover:bg-white/20 rounded-[100px] px-[16px] py-[12px] transition-all text-[14px] font-semibold uppercase leading-[16px]"
                >
                  {user?.role === "ADMIN" || user?.role === "SALES_MANAGER"
                    ? translate({
                        ru: "Панель админа",
                        uz: "Admin paneli",
                        en: "Admin Panel",
                        de: "Admin-Panel",
                      })
                    : translate({
                        ru: "Личный кабинет",
                        uz: "Shaxsiy kabinet",
                        en: "User Panel",
                        de: "Benutzerpanel",
                      })}
                </Link>
                <button
                  onClick={handleAuthAction}
                  className="text-white border border-white hover:bg-white/10 rounded-[100px] px-[16px] py-[12px] transition-all text-[14px] font-semibold uppercase leading-[16px]"
                >
                  {translate({
                    ru: "Выйти",
                    uz: "Chiqish",
                    en: "Logout",
                    de: "Abmelden",
                  })}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="hidden lg:block text-white border border-white hover:bg-white/10 rounded-[100px] px-[16px] py-[12px] transition-all text-[14px] font-semibold uppercase leading-[16px]"
              >
                {translate({
                  ru: "Забронировать",
                  uz: "Bron qilish",
                  en: "Book",
                  de: "Buchen",
                })}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
          {/* Golden background */}
          <div className="absolute inset-0 bg-[#9B8450]"></div>

          {/* Header with close button */}
          <div className="relative z-10 pt-4 px-4">
            <div className="backdrop-blur-sm bg-[rgba(51,51,51,0.1)] rounded-[16px] px-[32px] py-[12px] shadow-lg flex justify-between items-center text-white">
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-[24px] h-[24px] relative"
                aria-label="Close menu"
              >
                <span className="absolute top-1/2 left-0 w-full h-[2px] bg-white rounded transform rotate-45"></span>
                <span className="absolute top-1/2 left-0 w-full h-[2px] bg-white rounded transform -rotate-45"></span>
              </button>

              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                  }
                  className="flex items-center gap-[4px] text-white"
                >
                  <span className="text-[14px] font-medium uppercase leading-[16px]">
                    {
                      languageOptions.find((opt) => opt.value === language)
                        ?.label
                    }
                  </span>
                  <img
                    src="/language-dropdown-arrow.svg"
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden min-w-[80px]">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleLanguageChange(option.value)}
                        className={`w-full px-4 py-2.5 text-left text-[14px] font-medium uppercase transition-all ${
                          language === option.value
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Logo */}
              <img
                src="/loho_white_png.webp"
                alt="DJIDALI"
                className="h-[36px] w-auto mx-[5px]"
              />
            </div>
          </div>

          {/* Menu Items */}
          <nav className="relative z-10 flex flex-col items-start px-8 pt-16 gap-8">
            <button
              onClick={() => {
                navigate("/about");
                setIsMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-medium leading-[1.2] tracking-tight hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "О нас",
                uz: "Biz haqimizda",
                en: "About",
                de: "Über uns",
              })}
            </button>
            <button
              onClick={() => {
                navigate("/tourism-types");
                setIsMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-medium leading-[1.2] tracking-tight hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Виды туризма",
                uz: "Turizm turlari",
                en: "Tourism Types",
                de: "Tourismusarten",
              })}
            </button>
            <button
              onClick={() => {
                navigate("/tours");
                setIsMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-medium leading-[1.2] tracking-tight hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Наши туры",
                uz: "Bizning turlarimiz",
                en: "Our Tours",
                de: "Unsere Touren",
              })}
            </button>
            <button
              onClick={() => {
                navigate("/news");
                setIsMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-medium leading-[1.2] tracking-tight hover:opacity-80 transition-opacity"
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
              onClick={() => {
                navigate("/contact");
                setIsMobileMenuOpen(false);
              }}
              className="text-white text-[32px] font-medium leading-[1.2] tracking-tight hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Контакты",
                uz: "Aloqa",
                en: "Contact",
                de: "Kontakt",
              })}
            </button>
          </nav>

          {/* Book Button at Bottom */}
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <button
              onClick={() => {
                handleAuthAction();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between text-white text-[24px] font-medium leading-[1.2] hover:opacity-80 transition-opacity border-b-2 border-white pb-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {translate({
                ru: "Забронировать",
                uz: "Bron qilish",
                en: "Book",
                de: "Buchen",
              })}
              <span className="text-[32px]">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
