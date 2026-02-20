import React, { ReactNode, useState } from "react";
import { Search, Menu } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === "ru") {
      if (hour < 12) return "Доброе утро";
      if (hour < 18) return "Добрый день";
      return "Добрый вечер";
    }
    if (language === "uz") {
      if (hour < 12) return "Xayrli tong";
      if (hour < 18) return "Xayrli kun";
      return "Xayrli kech";
    }
    if (language === "de") {
      if (hour < 12) return "Guten Morgen";
      if (hour < 18) return "Guten Tag";
      return "Guten Abend";
    }
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getSubtitle = () => {
    if (language === "ru") return "Вот что происходит с вашими турами";
    if (language === "uz") return "Sayohatlaringiz haqida ma'lumot";
    if (language === "de") return "Hier ist, was mit Ihren Reisen passiert";
    return "Here's what's happening with your trips";
  };

  const getSearchPlaceholder = () => {
    if (language === "ru") return "Поиск туров...";
    if (language === "uz") return "Turlarni qidirish...";
    if (language === "de") return "Touren suchen...";
    return "Search tours...";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (with mobile overlay) */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          {/* Left - Hamburger + Greeting */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                {getGreeting()},{" "}
                <span className="text-[#8f7b49]">
                  {user?.firstName ||
                    (language === "ru"
                      ? "Путешественник"
                      : language === "uz"
                        ? "Sayohatchi"
                        : language === "de"
                          ? "Reisender"
                          : "Traveler")}
                </span>
              </h1>
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {title || getSubtitle()}
              </p>
            </div>
          </div>

          {/* Right - Search (hidden on mobile) */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8f7b49]/20 focus:border-[#8f7b49] transition-all"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content - responsive padding */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
