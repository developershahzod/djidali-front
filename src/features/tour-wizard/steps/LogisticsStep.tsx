import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPinned, Users, AlertCircle, Globe } from "lucide-react";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import LocationPicker from "@/components/LocationPicker";
import { TOUR_REGIONS } from "../types";

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

const LogisticsStep: React.FC = () => {
  const { formData, updateFormData } = useTourWizardStore();
  const { t } = useLanguage();

  // Get today's date for min attribute
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // Calculate days between dates
  const getDaysBetween = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : null;
  };

  const daysBetween = getDaysBetween();
  const dateWarning =
    daysBetween !== null && formData.duration !== daysBetween
      ? t("wizard.logistics.dateWarning")
          .replace("{selected}", String(daysBetween))
          .replace("{duration}", String(formData.duration))
      : null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-2xl mb-4">
          <Calendar className="w-8 h-8 text-sky-600" />
        </div>
        <h2
          className="text-2xl font-semibold text-slate-900 mb-2"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {t("wizard.logistics.heroTitle")}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {t("wizard.logistics.heroDescription")}
        </p>
      </motion.div>

      {/* Destination */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
            <MapPinned className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {t("wizard.logistics.destination")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("wizard.logistics.destinationDesc")}
            </p>
          </div>
        </div>

        <LocationPicker
          value={{
            destination: formData.destination,
            latitude: formData.latitude,
            longitude: formData.longitude,
          }}
          onChange={(location) => {
            updateFormData("destination", location.destination);
            updateFormData("latitude", location.latitude);
            updateFormData("longitude", location.longitude);
          }}
          placeholder={t("wizard.logistics.destinationPlaceholder")}
          label={t("wizard.logistics.primaryDestination")}
        />
      </motion.div>

      {/* Region for Search/Filtering */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {t("wizard.logistics.region") || "Регион для поиска"}
            </h3>
            <p className="text-sm text-slate-500">
              {t("wizard.logistics.regionDesc") ||
                "Выберите регион для удобного поиска туров клиентами"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TOUR_REGIONS.map((region) => {
            const isSelected =
              formData.regions?.includes(region.value) ?? false;
            return (
              <button
                key={region.value}
                type="button"
                onClick={() => {
                  const currentRegions = formData.regions || [];
                  const newRegions = isSelected
                    ? currentRegions.filter((r) => r !== region.value)
                    : [...currentRegions, region.value];
                  updateFormData("regions", newRegions);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent"
                }`}
              >
                {region.labelRu}
              </button>
            );
          })}
        </div>

        {formData.regions && formData.regions.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-emerald-700">
              Выбрано регионов: <strong>{formData.regions.length}</strong> —{" "}
              {formData.regions
                .map(
                  (r) => TOUR_REGIONS.find((reg) => reg.value === r)?.labelRu,
                )
                .join(", ")}
            </span>
            <button
              type="button"
              onClick={() => updateFormData("regions", [])}
              className="text-emerald-600 hover:text-emerald-800 text-sm"
            >
              Сбросить
            </button>
          </div>
        )}
      </motion.div>

      {/* Date Selection */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {t("wizard.logistics.tourDates")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("wizard.logistics.tourDatesDesc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              {t("wizard.logistics.startDate")}
            </Label>
            <Input
              type="date"
              value={formData.startDate}
              min={getTodayDate()}
              onChange={(e) => updateFormData("startDate", e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">
              {t("wizard.logistics.endDate")}
            </Label>
            <Input
              type="date"
              value={formData.endDate}
              min={formData.startDate || getTodayDate()}
              onChange={(e) => updateFormData("endDate", e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* Date warning */}
        {dateWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{dateWarning}</p>
          </motion.div>
        )}

        {/* Duration display */}
        {daysBetween && daysBetween > 0 && (
          <div className="mt-4 p-4 bg-sky-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-sky-700">
                {t("wizard.logistics.tourDuration")}
              </span>
              <span className="font-semibold text-sky-900">
                {daysBetween}{" "}
                {daysBetween === 1
                  ? t("wizard.logistics.day")
                  : t("wizard.logistics.days")}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Capacity */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {t("wizard.logistics.groupSize")}
            </h3>
            <p className="text-sm text-slate-500">
              {t("wizard.logistics.groupSizeDesc")}
            </p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            {t("wizard.logistics.maxParticipants")}
          </Label>
          <div className="relative">
            <Input
              type="number"
              min={1}
              max={100}
              value={formData.maxParticipants}
              onChange={(e) =>
                updateFormData("maxParticipants", parseInt(e.target.value) || 1)
              }
              className="h-12 text-lg pr-20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              {t("wizard.logistics.people")}
            </span>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[5, 10, 15, 20, 25, 30].map((num) => (
            <button
              key={num}
              onClick={() => updateFormData("maxParticipants", num)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.maxParticipants === num
                  ? "bg-violet-100 text-violet-700 border-2 border-violet-300"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 border-2 border-transparent"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Size recommendations */}
        <div className="mt-6 p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border border-violet-100">
          <h4 className="font-medium text-violet-900 mb-2">
            {t("wizard.logistics.sizeRecommendations")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-slate-600">
                {t("wizard.logistics.sizeSmall")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-slate-600">
                {t("wizard.logistics.sizeMedium")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full" />
              <span className="text-slate-600">
                {t("wizard.logistics.sizeLarge")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white"
      >
        <h4 className="font-medium text-slate-300 mb-4 text-sm uppercase tracking-wide">
          {t("wizard.logistics.summary")}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-xs mb-1">
              {t("wizard.logistics.destination")}
            </p>
            <p className="font-medium">
              {formData.destination || t("wizard.logistics.notSet")}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">
              {t("wizard.logistics.startDate")}
            </p>
            <p className="font-medium">
              {formData.startDate
                ? new Date(formData.startDate).toLocaleDateString()
                : t("wizard.logistics.notSet")}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">
              {t("wizard.logistics.endDate")}
            </p>
            <p className="font-medium">
              {formData.endDate
                ? new Date(formData.endDate).toLocaleDateString()
                : t("wizard.logistics.notSet")}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">
              {t("wizard.logistics.maxGroup")}
            </p>
            <p className="font-medium">
              {formData.maxParticipants} {t("wizard.logistics.people")}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogisticsStep;
