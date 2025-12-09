import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Compass,
  FileText,
  Calendar,
  Image,
  MapPin,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  Edit3,
} from "lucide-react";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { WIZARD_STEPS, WizardStep, LANGUAGES } from "../types";
import { getImageUrl } from "../../../utils/imageUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ReviewStep: React.FC = () => {
  const { formData, setStep, completedSteps } = useTourWizardStore();
  const { t } = useLanguage();

  const getCompletionStatus = () => {
    const issues: string[] = [];

    // Check title
    if (
      !formData.title.uz &&
      !formData.title.ru &&
      !formData.title.eng &&
      !formData.title.de
    ) {
      issues.push(t("wizard.validation.titleRequired"));
    }

    // Check category
    if (!formData.categoryId) {
      issues.push(t("wizard.validation.categoryRequired"));
    }

    // Check description
    if (
      !formData.description.uz &&
      !formData.description.ru &&
      !formData.description.eng &&
      !formData.description.de
    ) {
      issues.push(t("wizard.validation.descriptionRequired"));
    }

    // Check dates
    if (!formData.startDate || !formData.endDate) {
      issues.push(t("wizard.validation.datesIncomplete"));
    }

    // Check destination
    if (!formData.destination) {
      issues.push(t("wizard.validation.destinationRequired"));
    }

    // Check images
    if (formData.images.length === 0) {
      issues.push(t("wizard.validation.noImages"));
    }

    return issues;
  };

  const issues = getCompletionStatus();
  const isComplete = issues.length === 0;

  const displayTitle =
    formData.title.ru ||
    formData.title.eng ||
    formData.title.uz ||
    t("wizard.review.untitledTour");
  const displayDescription =
    formData.description.ru ||
    formData.description.eng ||
    formData.description.uz ||
    t("wizard.review.noDescription");

  const stepIcons = {
    1: Compass,
    2: FileText,
    3: Calendar,
    4: Image,
    5: CheckCircle,
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") {
      return `$${price.toLocaleString()}`;
    }
    return `${price.toLocaleString()} UZS`;
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
        <div
          className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
            isComplete ? "bg-emerald-100" : "bg-amber-100",
          )}
        >
          {isComplete ? (
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          )}
        </div>
        <h2
          className="text-2xl font-semibold text-slate-900 mb-2"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {isComplete
            ? t("wizard.review.readyTitle")
            : t("wizard.review.almostTitle")}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {isComplete
            ? t("wizard.review.readySubtitle")
            : t("wizard.review.almostSubtitle")}
        </p>
      </motion.div>

      {/* Issues Alert */}
      {!isComplete && (
        <motion.div
          variants={itemVariants}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-2">
                {t("wizard.review.missingInfo")}
              </h4>
              <ul className="space-y-1">
                {issues.map((issue, index) => (
                  <li
                    key={index}
                    className="text-sm text-amber-700 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-amber-500 rounded-full" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Steps Completion Status */}
      <motion.div variants={itemVariants}>
        <h3 className="font-medium text-slate-700 mb-3">
          {t("wizard.review.completionStatus")}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {WIZARD_STEPS.map((step) => {
            const Icon = stepIcons[step.id as keyof typeof stepIcons];
            const isCompleted = completedSteps.has(step.id as WizardStep);
            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id as WizardStep)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border transition-colors",
                  isCompleted
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-300",
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{t(step.titleKey)}</span>
                {isCompleted && (
                  <CheckCircle className="w-3 h-3 mt-1 text-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tour Preview Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm"
      >
        {/* Cover Image */}
        {formData.images.length > 0 && (
          <div className="relative h-48 md:h-64">
            <img
              src={getImageUrl(formData.images[0])}
              alt="Tour cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className="bg-emerald-500 text-white mb-2">
                {formData.status}
              </Badge>
              <h3
                className="text-xl md:text-2xl font-semibold text-white"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {displayTitle}
              </h3>
            </div>
          </div>
        )}

        {/* Tour Details */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {t("wizard.review.destination")}
                </p>
                <p className="font-medium text-slate-900">
                  {formData.destination || t("wizard.review.notSet")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {t("wizard.review.duration")}
                </p>
                <p className="font-medium text-slate-900">
                  {formData.duration}{" "}
                  {formData.duration === 1
                    ? t("wizard.review.day")
                    : t("wizard.review.days")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {t("wizard.review.price")}
                </p>
                <p className="font-medium text-slate-900">
                  {formatPrice(formData.price, formData.currency)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {t("wizard.review.maxGroup")}
                </p>
                <p className="font-medium text-slate-900">
                  {formData.maxParticipants} {t("wizard.review.people")}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-medium text-slate-700 mb-2">
              {t("wizard.review.description")}
            </h4>
            <p className="text-slate-600 line-clamp-3">{displayDescription}</p>
          </div>

          {/* Dates */}
          {(formData.startDate || formData.endDate) && (
            <div className="mb-6 p-4 bg-sky-50 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2">
                {t("wizard.review.tourDates")}
              </h4>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-slate-500">
                    {t("wizard.review.start")}:{" "}
                  </span>
                  <span className="font-medium">
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString()
                      : t("wizard.review.notSet")}
                  </span>
                </div>
                <span className="text-slate-300">→</span>
                <div>
                  <span className="text-slate-500">
                    {t("wizard.review.end")}:{" "}
                  </span>
                  <span className="font-medium">
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString()
                      : t("wizard.review.notSet")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Summary */}
          {formData.itinerary.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 mb-2">
                {t("wizard.review.itinerary")} ({formData.itinerary.length}{" "}
                {formData.itinerary.length === 1
                  ? t("wizard.review.day")
                  : t("wizard.review.days")}
                )
              </h4>
              <div className="space-y-2">
                {formData.itinerary.slice(0, 3).map((day, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-medium text-amber-700">
                      {index + 1}
                    </span>
                    <span className="text-slate-600 truncate">
                      {day.title.ru ||
                        day.title.eng ||
                        day.title.uz ||
                        t("wizard.review.dayNumber").replace(
                          "{number}",
                          String(index + 1),
                        )}
                    </span>
                  </div>
                ))}
                {formData.itinerary.length > 3 && (
                  <p className="text-xs text-slate-400 pl-9">
                    +{formData.itinerary.length - 3}{" "}
                    {t("wizard.review.moreDays")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Images */}
          {formData.images.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-700 mb-2">
                {t("wizard.review.gallery")} ({formData.images.length}{" "}
                {formData.images.length === 1
                  ? t("wizard.review.image")
                  : t("wizard.review.images")}
                )
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {formData.images.slice(0, 5).map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden"
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {formData.images.length > 5 && (
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-stone-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-500">
                      +{formData.images.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Translation Status */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <h4 className="font-medium text-slate-700 mb-3">
              {t("wizard.review.translationStatus")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const hasTitle = !!formData.title[lang.code];
                const hasDesc = !!formData.description[lang.code];
                const isComplete = hasTitle && hasDesc;
                return (
                  <div
                    key={lang.code}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                      isComplete
                        ? "bg-emerald-50 text-emerald-700"
                        : hasTitle || hasDesc
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-400",
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-medium">
                      {lang.code.toUpperCase()}
                    </span>
                    {isComplete ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : hasTitle || hasDesc ? (
                      <span className="text-xs">
                        {t("wizard.review.partial")}
                      </span>
                    ) : (
                      <span className="text-xs">
                        {t("wizard.review.missing")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Buttons */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        {WIZARD_STEPS.slice(0, 4).map((step) => (
          <Button
            key={step.id}
            variant="outline"
            size="sm"
            onClick={() => setStep(step.id as WizardStep)}
            className="gap-2"
          >
            <Edit3 className="w-3 h-3" />
            {t("wizard.review.edit")} {t(step.titleKey)}
          </Button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ReviewStep;
