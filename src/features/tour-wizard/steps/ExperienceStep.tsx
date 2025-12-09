import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  GripVertical,
} from "lucide-react";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { LanguageTabs, LanguageTabsCompact } from "../components/LanguageTabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

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

const ExperienceStep: React.FC = () => {
  const {
    formData,
    updateMultilingualField,
    activeLanguage,
    addItineraryDay,
    removeItineraryDay,
    updateItineraryText,
    addListItem,
    updateListItem,
    removeListItem,
  } = useTourWizardStore();
  const { t } = useLanguage();

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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <h2
          className="text-2xl font-semibold text-slate-900 mb-2"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {t("wizard.experience.heroTitle")}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {t("wizard.experience.heroDescription")}
        </p>
      </motion.div>

      {/* Description Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.experience.tourDescription")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.experience.tourDescriptionDesc")}
              </p>
            </div>
          </div>
          <LanguageTabs />
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            {t("wizard.experience.descriptionIn").replace(
              "{language}",
              getLanguageLabel(activeLanguage),
            )}
          </Label>
          <Textarea
            value={formData.description[activeLanguage]}
            onChange={(e) =>
              updateMultilingualField(
                "description",
                activeLanguage,
                e.target.value,
              )
            }
            placeholder={t("wizard.experience.descriptionPlaceholder").replace(
              "{language}",
              getLanguageLabel(activeLanguage),
            )}
            rows={6}
            className="resize-none"
          />
          <p className="mt-2 text-xs text-slate-400">
            {formData.description[activeLanguage].length}{" "}
            {t("wizard.experience.characters")}
          </p>
        </div>

        {/* Preview of other languages */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100 mt-4">
          {(["uz", "ru", "eng", "de"] as const)
            .filter((lang) => lang !== activeLanguage)
            .map((lang) => (
              <div
                key={lang}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs",
                  formData.description[lang]
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-400",
                )}
              >
                <span className="font-medium">{lang.toUpperCase()}</span>
                {formData.description[lang] ? (
                  <span>{t("wizard.experience.written")}</span>
                ) : (
                  <span className="italic">
                    {t("wizard.experience.missing")}
                  </span>
                )}
              </div>
            ))}
        </div>
      </motion.div>

      {/* Itinerary Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.experience.itinerary")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.experience.itineraryDesc")}
              </p>
            </div>
          </div>
          <LanguageTabsCompact />
        </div>

        <div className="space-y-4">
          {formData.itinerary.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative bg-stone-50 rounded-lg p-4 border border-stone-200"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-slate-700">
                    {t("wizard.experience.day").replace(
                      "{number}",
                      String(index + 1),
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-slate-400 hover:text-slate-600 cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </button>
                  {formData.itinerary.length > 1 && (
                    <button
                      onClick={() => removeItineraryDay(index)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day Content */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1 block">
                    {t("wizard.experience.dayTitle").replace(
                      "{language}",
                      activeLanguage.toUpperCase(),
                    )}
                  </Label>
                  <Input
                    value={day.title[activeLanguage]}
                    onChange={(e) =>
                      updateItineraryText(
                        index,
                        "title",
                        activeLanguage,
                        e.target.value,
                      )
                    }
                    placeholder={t("wizard.experience.dayTitlePlaceholder")}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-600 mb-1 block">
                    {t("wizard.experience.dayDescription").replace(
                      "{language}",
                      activeLanguage.toUpperCase(),
                    )}
                  </Label>
                  <Textarea
                    value={day.description[activeLanguage]}
                    onChange={(e) =>
                      updateItineraryText(
                        index,
                        "description",
                        activeLanguage,
                        e.target.value,
                      )
                    }
                    placeholder={t("wizard.experience.dayDescPlaceholder")}
                    rows={3}
                    className="bg-white resize-none"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addItineraryDay}
          className="mt-4 w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("wizard.experience.addDay").replace(
            "{number}",
            String(formData.itinerary.length + 1),
          )}
        </Button>
      </motion.div>

      {/* Inclusions & Exclusions */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Inclusions */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.experience.included")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.experience.includedDesc")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {formData.inclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <Input
                  value={item[activeLanguage]}
                  onChange={(e) =>
                    updateListItem(
                      "inclusions",
                      index,
                      activeLanguage,
                      e.target.value,
                    )
                  }
                  placeholder={t("wizard.experience.itemPlaceholder").replace(
                    "{number}",
                    String(index + 1),
                  )}
                  className="flex-1"
                />
                {formData.inclusions.length > 1 && (
                  <button
                    onClick={() => removeListItem("inclusions", index)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addListItem("inclusions")}
            className="mt-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("wizard.experience.addItem")}
          </Button>
        </div>

        {/* Exclusions */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                {t("wizard.experience.notIncluded")}
              </h3>
              <p className="text-sm text-slate-500">
                {t("wizard.experience.notIncludedDesc")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {formData.exclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <Input
                  value={item[activeLanguage]}
                  onChange={(e) =>
                    updateListItem(
                      "exclusions",
                      index,
                      activeLanguage,
                      e.target.value,
                    )
                  }
                  placeholder={t("wizard.experience.itemPlaceholder").replace(
                    "{number}",
                    String(index + 1),
                  )}
                  className="flex-1"
                />
                {formData.exclusions.length > 1 && (
                  <button
                    onClick={() => removeListItem("exclusions", index)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addListItem("exclusions")}
            className="mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("wizard.experience.addItem")}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExperienceStep;
