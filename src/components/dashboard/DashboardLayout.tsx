import React, { ReactNode } from "react";
import { Search } from "lucide-react";
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
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Minimal Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          {/* Left - Greeting */}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
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
            <p className="text-sm text-gray-500">{title || getSubtitle()}</p>
          </div>

          {/* Right - Search */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
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

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
