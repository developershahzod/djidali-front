import React from "react";
import { motion } from "framer-motion";
import { Check, Circle, ChevronRight } from "lucide-react";
import { WIZARD_STEPS, WizardStep } from "../types";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Abstract travel-themed SVG patterns for each step
const StepPatterns: Record<number, React.ReactNode> = {
  1: (
    // Compass/Direction pattern
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-10">
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <circle
        cx="100"
        cy="100"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="100"
        y1="20"
        x2="100"
        y2="180"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <line
        x1="20"
        y1="100"
        x2="180"
        y2="100"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <polygon points="100,30 95,50 105,50" fill="currentColor" />
    </svg>
  ),
  2: (
    // Journey/Path pattern
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-10">
      <path
        d="M20 180 Q60 140 80 160 T140 120 T180 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle cx="20" cy="180" r="6" fill="currentColor" />
      <circle cx="80" cy="160" r="4" fill="currentColor" />
      <circle cx="140" cy="120" r="4" fill="currentColor" />
      <circle cx="180" cy="20" r="6" fill="currentColor" />
    </svg>
  ),
  3: (
    // Calendar/Time pattern
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-10">
      <rect
        x="30"
        y="40"
        width="140"
        height="120"
        rx="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="30"
        y1="70"
        x2="170"
        y2="70"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="60" cy="100" r="8" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.5" />
      <circle cx="140" cy="100" r="8" fill="currentColor" />
      <line
        x1="60"
        y1="55"
        x2="60"
        y2="35"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="140"
        y1="55"
        x2="140"
        y2="35"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  4: (
    // Gallery/Images pattern
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-10">
      <rect
        x="20"
        y="40"
        width="80"
        height="60"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="100"
        y="40"
        width="80"
        height="60"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="60"
        y="110"
        width="80"
        height="60"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="45" cy="60" r="8" fill="currentColor" opacity="0.5" />
      <path
        d="M20 90 L50 70 L80 85 L100 75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  ),
  5: (
    // Checkmark/Complete pattern
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-10">
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M65 100 L90 125 L140 75"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

interface WizardSidebarProps {
  onClose?: () => void;
}

export const WizardSidebar: React.FC<WizardSidebarProps> = ({ onClose }) => {
  const { currentStep, completedSteps, setStep, canNavigateToStep, formData } =
    useTourWizardStore();
  const { t } = useLanguage();

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId as WizardStep)) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const displayTitle =
    formData.title.ru || formData.title.eng || formData.title.uz || "New Tour";

  return (
    <div className="relative h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Abstract pattern background */}
      <div className="absolute inset-0 text-emerald-400/80 pointer-events-none">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {StepPatterns[currentStep]}
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <span className="text-xs font-medium tracking-[0.2em] text-emerald-400 uppercase">
              {t("wizard.tourCreator")}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-2xl font-medium text-white truncate"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {displayTitle}
          </motion.h2>
        </div>

        {/* Steps */}
        <nav className="flex-1 space-y-2">
          {WIZARD_STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const canNavigate = canNavigateToStep(step.id as WizardStep);

            return (
              <motion.button
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => canNavigate && setStep(step.id as WizardStep)}
                disabled={!canNavigate}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 text-left group",
                  status === "current" && "bg-white/10",
                  status === "completed" &&
                    canNavigate &&
                    "hover:bg-white/5 cursor-pointer",
                  status === "upcoming" &&
                    !canNavigate &&
                    "opacity-40 cursor-not-allowed",
                  status === "upcoming" &&
                    canNavigate &&
                    "hover:bg-white/5 cursor-pointer",
                )}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                    status === "completed" &&
                      "bg-emerald-500 border-emerald-500",
                    status === "current" &&
                      "border-emerald-400 bg-emerald-400/20",
                    status === "upcoming" && "border-slate-600",
                  )}
                >
                  {status === "completed" ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : status === "current" ? (
                    <Circle className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  ) : (
                    <span className="text-xs text-slate-500">{step.id}</span>
                  )}
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium text-sm transition-colors",
                      status === "current" && "text-white",
                      status === "completed" && "text-slate-300",
                      status === "upcoming" && "text-slate-500",
                    )}
                  >
                    {t(step.titleKey)}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {t(step.descKey)}
                  </p>
                </div>

                {/* Arrow for current */}
                {status === "current" && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Progress indicator */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{t("wizard.progress")}</span>
            <span>{Math.round((completedSteps.size / 5) * 100)}%</span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.size / 5) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
