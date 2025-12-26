import React, { useState, useEffect } from "react";
import {
  Save,
  Image as ImageIcon,
  Type,
  Globe,
  Palette,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { cn } from "../../lib/utils";

interface HeroSettings {
  titleRu: string;
  titleUz: string;
  titleEn: string;
  titleDe: string;
  subtitleRu: string;
  subtitleUz: string;
  subtitleEn: string;
  subtitleDe: string;
  backgroundImage: string;
  overlayOpacity: number;
  buttonText: string;
  buttonLink: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    telegram: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
}

const initialHeroSettings: HeroSettings = {
  titleRu: "Откройте красоту Узбекистана",
  titleUz: "O'zbekiston go'zalligini kashf eting",
  titleEn: "Discover the beauty of Uzbekistan",
  titleDe: "Entdecken Sie die Schönheit Usbekistans",
  subtitleRu: "Незабываемые путешествия по древнему Шёлковому пути",
  subtitleUz: "Qadimiy Ipak yo'li bo'ylab unutilmas sayohatlar",
  subtitleEn: "Unforgettable journeys along the ancient Silk Road",
  subtitleDe: "Unvergessliche Reisen entlang der alten Seidenstraße",
  backgroundImage: "/hero-bg.webp",
  overlayOpacity: 40,
  buttonText: "Найти тур",
  buttonLink: "/tours",
};

const initialSiteSettings: SiteSettings = {
  siteName: "Djidali Travel",
  siteDescription: "Eco-tourism and adventure travel in Uzbekistan",
  contactEmail: "info@djidali.uz",
  contactPhone: "+998 90 123 45 67",
  address: "Tashkent, Uzbekistan",
  socialLinks: {
    telegram: "https://t.me/djidali",
    instagram: "https://instagram.com/djidali",
    facebook: "https://facebook.com/djidali",
    youtube: "",
  },
};

const AdminSettingsPage = () => {
  const [activeSection, setActiveSection] = useState<"hero" | "site">("hero");
  const [heroSettings, setHeroSettings] =
    useState<HeroSettings>(initialHeroSettings);
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(initialSiteSettings);
  const [activeTab, setActiveTab] = useState<"ru" | "uz" | "en" | "de">("ru");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedHero = localStorage.getItem("djidali_hero_settings");
    const savedSite = localStorage.getItem("djidali_site_settings");
    if (savedHero) {
      try {
        setHeroSettings(JSON.parse(savedHero));
      } catch (_e) {
        console.error("Failed to parse hero settings");
      }
    }
    if (savedSite) {
      try {
        setSiteSettings(JSON.parse(savedSite));
      } catch (_e) {
        console.error("Failed to parse site settings");
      }
    }
  }, []);

  const handleHeroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setHeroSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSiteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialKey = name.replace(
        "social_",
        "",
      ) as keyof SiteSettings["socialLinks"];
      setSiteSettings((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setSiteSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // In a real app, this would be an API call
      // await djidaliApi.updateSettings({ hero: heroSettings, site: siteSettings });

      // For now, save to localStorage
      localStorage.setItem(
        "djidali_hero_settings",
        JSON.stringify(heroSettings),
      );
      localStorage.setItem(
        "djidali_site_settings",
        JSON.stringify(siteSettings),
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (_error) {
      setSaveError("Ошибка сохранения настроек");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: "ru" as const, label: "RU" },
    { key: "uz" as const, label: "UZ" },
    { key: "en" as const, label: "EN" },
    { key: "de" as const, label: "DE" },
  ];

  const sections = [
    {
      key: "hero" as const,
      label: "Hero баннер",
      icon: <ImageIcon className="h-4 w-4" />,
    },
    {
      key: "site" as const,
      label: "Общие настройки",
      icon: <Palette className="h-4 w-4" />,
    },
  ];

  return (
    <AdminLayout
      title="Настройки сайта"
      subtitle="Конфигурация"
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all",
            saveSuccess
              ? "bg-green-500"
              : "bg-gradient-to-r from-[#8F6E47] to-[#BFA480] hover:-translate-y-0.5",
            saving && "opacity-50",
          )}
        >
          {saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              Сохранено
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {saving ? "Сохранение..." : "Сохранить"}
            </>
          )}
        </button>
      }
    >
      {saveError && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {saveError}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-2 shadow-lg backdrop-blur">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                  activeSection === section.key
                    ? "bg-[#2F2A24] text-white"
                    : "text-[#6B5B4C] hover:bg-[#F7F1E6]",
                )}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeSection === "hero" && (
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#2F2A24]">
                    Настройки Hero баннера
                  </h3>
                  <p className="text-sm text-[#8E7A5E]">
                    Управление главным баннером на главной странице
                  </p>
                </div>
                {/* Language tabs */}
                <div className="flex gap-1 rounded-lg bg-[#F7F1E6] p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                        activeTab === tab.key
                          ? "bg-white text-[#2F2A24] shadow-sm"
                          : "text-[#8E7A5E] hover:text-[#2F2A24]",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hero Preview */}
              <div className="mb-6 overflow-hidden rounded-2xl">
                <div
                  className="relative h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: heroSettings.backgroundImage
                      ? `url(${heroSettings.backgroundImage})`
                      : "linear-gradient(135deg, #8F6E47 0%, #BFA480 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: heroSettings.overlayOpacity / 100 }}
                  />
                  <div className="relative flex h-full flex-col items-center justify-center p-6 text-center text-white">
                    <h2 className="mb-2 text-2xl font-bold">
                      {heroSettings[
                        `title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof HeroSettings
                      ] || "Заголовок"}
                    </h2>
                    <p className="text-sm opacity-90">
                      {heroSettings[
                        `subtitle${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof HeroSettings
                      ] || "Подзаголовок"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#6B5B4C]">
                    <Type className="h-4 w-4" />
                    Заголовок ({activeTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    name={`title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                    value={
                      heroSettings[
                        `title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof HeroSettings
                      ] as string
                    }
                    onChange={handleHeroChange}
                    className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    placeholder="Введите заголовок..."
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#6B5B4C]">
                    <Globe className="h-4 w-4" />
                    Подзаголовок ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    name={`subtitle${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                    value={
                      heroSettings[
                        `subtitle${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof HeroSettings
                      ] as string
                    }
                    onChange={handleHeroChange}
                    rows={2}
                    className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    placeholder="Введите подзаголовок..."
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#6B5B4C]">
                    <ImageIcon className="h-4 w-4" />
                    URL фонового изображения
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="backgroundImage"
                      value={heroSettings.backgroundImage}
                      onChange={handleHeroChange}
                      className="flex-1 rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                      placeholder="/hero-bg.jpg или https://..."
                    />
                    <button className="rounded-xl border border-[#E2D5C1] bg-[#F7F1E6] px-4 py-2.5 text-sm font-medium text-[#6B5B4C] transition-colors hover:bg-[#E2D5C1]">
                      <Upload className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Overlay Opacity */}
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-[#6B5B4C]">
                    <span className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Затемнение фона
                    </span>
                    <span className="text-[#2F2A24]">
                      {heroSettings.overlayOpacity}%
                    </span>
                  </label>
                  <input
                    type="range"
                    name="overlayOpacity"
                    min="0"
                    max="80"
                    value={heroSettings.overlayOpacity}
                    onChange={handleHeroChange}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E2D5C1] accent-[#8F6E47]"
                  />
                </div>

                {/* Button Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                      Текст кнопки
                    </label>
                    <input
                      type="text"
                      name="buttonText"
                      value={heroSettings.buttonText}
                      onChange={handleHeroChange}
                      className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                      placeholder="Найти тур"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                      Ссылка кнопки
                    </label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={heroSettings.buttonLink}
                      onChange={handleHeroChange}
                      className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                      placeholder="/tours"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "site" && (
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2F2A24]">
                  Общие настройки сайта
                </h3>
                <p className="text-sm text-[#8E7A5E]">
                  Базовая информация о сайте и контакты
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                      Название сайта
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={siteSettings.siteName}
                      onChange={handleSiteChange}
                      className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                      Email для связи
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={siteSettings.contactEmail}
                      onChange={handleSiteChange}
                      className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                    Описание сайта
                  </label>
                  <textarea
                    name="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={handleSiteChange}
                    rows={2}
                    className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                      Телефон
                    </label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={siteSettings.contactPhone}
                      onChange={handleSiteChange}
                      className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                      Адрес
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={siteSettings.address}
                      onChange={handleSiteChange}
                      className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-[#E2D5C1] pt-4">
                  <h4 className="mb-4 text-sm font-semibold text-[#2F2A24]">
                    Социальные сети
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                        Telegram
                      </label>
                      <input
                        type="text"
                        name="social_telegram"
                        value={siteSettings.socialLinks.telegram}
                        onChange={handleSiteChange}
                        className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                        placeholder="https://t.me/..."
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                        Instagram
                      </label>
                      <input
                        type="text"
                        name="social_instagram"
                        value={siteSettings.socialLinks.instagram}
                        onChange={handleSiteChange}
                        className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                        Facebook
                      </label>
                      <input
                        type="text"
                        name="social_facebook"
                        value={siteSettings.socialLinks.facebook}
                        onChange={handleSiteChange}
                        className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B5B4C]">
                        YouTube
                      </label>
                      <input
                        type="text"
                        name="social_youtube"
                        value={siteSettings.socialLinks.youtube}
                        onChange={handleSiteChange}
                        className="w-full rounded-xl border border-[#E2D5C1] bg-white px-4 py-2.5 text-[#2F2A24] focus:border-[#BFA480] focus:outline-none focus:ring-2 focus:ring-[#BFA480]/30"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
