import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, DollarSign, Clock, Tag, Sparkles } from "lucide-react";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { LanguageTabs } from "../components/LanguageTabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { djidaliApi, ApiCategory } from "../../../services/djidaliApi";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const EssentialsStep: React.FC = () => {
  const { formData, updateFormData, updateMultilingualField, activeLanguage } =
    useTourWizardStore();
  const { t } = useLanguage();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await djidaliApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      uz: t("wizard.language.uz"),
      ru: t("wizard.language.ru"),
      eng: t("wizard.language.eng"),
      de: t("wizard.language.de"),
    };
    return labels[lang] || lang.toUpperCase();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
          <Compass className="w-8 h-8 text-emerald-600" />
        </div>
        <h2
          className="text-2xl font-semibold text-slate-900 mb-2"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {t("wizard.essentials.heroTitle")}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {t("wizard.essentials.heroDescription")}
        </p>
      </motion.div>

      {/* Tour Title Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.essentials.tourTitle")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.essentials.tourTitleDesc")}
              </p>
            </div>
          </div>
          <LanguageTabs />
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="tour-title"
              className="text-sm font-medium text-slate-700 mb-2 block"
            >
              {t("wizard.essentials.titleIn").replace(
                "{language}",
                getLanguageLabel(activeLanguage),
              )}
            </Label>
            <Input
              id="tour-title"
              type="text"
              value={formData.title[activeLanguage]}
              onChange={(e) =>
                updateMultilingualField("title", activeLanguage, e.target.value)
              }
              placeholder={t("wizard.essentials.titlePlaceholder").replace(
                "{language}",
                getLanguageLabel(activeLanguage),
              )}
              className="text-lg h-12"
            />
          </div>

          {/* Preview of other languages */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(["uz", "ru", "eng", "de"] as const)
              .filter((lang) => lang !== activeLanguage)
              .map((lang) => (
                <div
                  key={lang}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs",
                    formData.title[lang]
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <span className="font-medium">{lang.toUpperCase()}</span>
                  {formData.title[lang] ? (
                    <span className="truncate max-w-32">
                      {formData.title[lang]}
                    </span>
                  ) : (
                    <span className="italic">
                      {t("wizard.essentials.notSet")}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Category & Status */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Category */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.essentials.category")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.essentials.categoryDesc")}
              </p>
            </div>
          </div>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => updateFormData("categoryId", value)}
            disabled={loadingCategories}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue
                placeholder={t("wizard.essentials.selectCategory")}
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {typeof category.name === "object"
                    ? (category.name as Record<string, string>)[
                        activeLanguage
                      ] ||
                      (category.name as Record<string, string>).ru ||
                      "Unknown"
                    : category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-sky-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.essentials.status")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.essentials.statusDesc")}
              </p>
            </div>
          </div>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              updateFormData(
                "status",
                value as
                  | "ACTIVE"
                  | "INACTIVE"
                  | "CANCELLED"
                  | "COMPLETED"
                  | "FULLY_BOOKED",
              )
            }
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  {t("wizard.essentials.statusActive")}
                </span>
              </SelectItem>
              <SelectItem value="INACTIVE">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full" />
                  {t("wizard.essentials.statusInactive")}
                </span>
              </SelectItem>
              <SelectItem value="CANCELLED">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  {t("wizard.essentials.statusCancelled")}
                </span>
              </SelectItem>
              <SelectItem value="COMPLETED">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  {t("wizard.essentials.statusCompleted")}
                </span>
              </SelectItem>
              <SelectItem value="FULLY_BOOKED">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  {t("wizard.essentials.statusFullyBooked")}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Duration & Pricing */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Duration */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.essentials.duration")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.essentials.durationDesc")}
              </p>
            </div>
          </div>
          <div className="relative">
            <Input
              type="number"
              min={1}
              value={formData.duration}
              onChange={(e) =>
                updateFormData("duration", parseInt(e.target.value) || 1)
              }
              className="h-12 text-lg pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              {t("wizard.essentials.days")}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.essentials.price")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.essentials.priceDesc")}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="number"
                min={1000}
                step={1}
                value={formData.price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  updateFormData("price", value);
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (value < 1000) {
                    updateFormData("price", 1000);
                  }
                }}
                className="h-12 text-lg"
              />
            </div>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                updateFormData("currency", value as "UZS" | "USD")
              }
            >
              <SelectTrigger className="w-28 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UZS">🇺🇿 UZS</SelectItem>
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Tip Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-1">
              {t("wizard.essentials.proTip")}
            </h4>
            <p className="text-sm text-emerald-700">
              {t("wizard.essentials.proTipText")}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EssentialsStep;
