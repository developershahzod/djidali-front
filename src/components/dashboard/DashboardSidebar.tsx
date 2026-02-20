import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Compass,
  LayoutDashboard,
  Heart,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  LogOut,
  ChevronRight,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

interface NavItem {
  icon: React.ElementType;
  label: string;
  labelRu?: string;
  labelUz?: string;
  labelDe?: string;
  path?: string;
  action?: () => void;
  external?: boolean;
}

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: "ru", label: "Русский" },
    { code: "uz", label: "O'zbekcha" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
  ];

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];

  const mainNavItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      labelRu: "Панель управления",
      labelUz: "Boshqaruv paneli",
      labelDe: "Übersicht",
      path: "/dashboard",
    },
    {
      icon: Heart,
      label: "Wishlist",
      labelRu: "Избранное",
      labelUz: "Sevimlilar",
      labelDe: "Wunschliste",
      path: "/dashboard/wishlist",
    },
    {
      icon: MapPin,
      label: "Explore Tours",
      labelDe: "Touren entdecken",
      labelRu: "Все туры",
      labelUz: "Barcha turlar",
      path: "/tours",
    },
  ];

  const getLabel = (item: NavItem) => {
    if (language === "ru" && item.labelRu) return item.labelRu;
    if (language === "uz" && item.labelUz) return item.labelUz;
    if (language === "de" && item.labelDe) return item.labelDe;
    return item.label;
  };

  const isActive = (path?: string) => path && location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (item: NavItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    // Close sidebar on mobile after navigation
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col h-full
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#8f7b49] to-[#a08957] rounded-xl flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 group-hover:text-[#8f7b49] transition-colors">
              Djidali
            </span>
          </button>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="px-3 py-4 border-b border-gray-100">
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="flex-1 text-left">{currentLang.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as "ru" | "uz" | "en");
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      language === lang.code
                        ? "bg-[#8f7b49]/10 text-[#8f7b49] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {language === "ru"
              ? "Меню"
              : language === "uz"
                ? "Menyu"
                : language === "de"
                  ? "Menü"
                  : "Menu"}
          </p>

          {mainNavItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#8f7b49]/10 text-[#8f7b49]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${active ? "text-[#8f7b49]" : "text-gray-400"}`}
                />
                <span className="flex-1 text-left">{getLabel(item)}</span>
                {active && <ChevronRight className="w-4 h-4 text-[#8f7b49]" />}
              </button>
            );
          })}

          {/* Help & Support Section */}
          <div className="pt-6">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {language === "ru"
                ? "Поддержка"
                : language === "uz"
                  ? "Yordam"
                  : language === "de"
                    ? "Hilfe"
                    : "Support"}
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-2">
              <a
                href="tel:+998944708844"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left">+998 (94) 470-88-44</span>
              </a>

              <a
                href="mailto:support@djidali.uz"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left truncate">
                  support@djidali.uz
                </span>
              </a>

              <a
                href="https://t.me/djidali_support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left">Telegram</span>
              </a>
            </div>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8f7b49] to-[#a08957] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            {language === "ru"
              ? "Выйти"
              : language === "uz"
                ? "Chiqish"
                : language === "de"
                  ? "Abmelden"
                  : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
