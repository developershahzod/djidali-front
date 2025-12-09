import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WizardSidebar } from "./WizardSidebar";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { WIZARD_STEPS } from "../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useConfirm } from "@/contexts/ConfirmContext";

// Step components (lazy loaded for performance)
const EssentialsStep = React.lazy(() => import("../steps/EssentialsStep"));
const ExperienceStep = React.lazy(() => import("../steps/ExperienceStep"));
const LogisticsStep = React.lazy(() => import("../steps/LogisticsStep"));
const MediaStep = React.lazy(() => import("../steps/MediaStep"));
const ReviewStep = React.lazy(() => import("../steps/ReviewStep"));

// Step renderer
const StepRenderer: React.FC = () => {
  const { currentStep } = useTourWizardStore();

  const stepComponents = {
    1: <EssentialsStep />,
    2: <ExperienceStep />,
    3: <LogisticsStep />,
    4: <MediaStep />,
    5: <ReviewStep />,
  };

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {stepComponents[currentStep]}
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

interface TourWizardLayoutProps {
  onSubmit: () => Promise<void>;
}

export const TourWizardLayout: React.FC<TourWizardLayoutProps> = ({
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { confirm } = useConfirm();
  const {
    currentStep,
    nextStep,
    prevStep,
    stepErrors,
    isSubmitting,
    isDirty,
    setSubmitting,
    resetWizard,
  } = useTourWizardStore();

  const currentStepInfo = WIZARD_STEPS.find((s) => s.id === currentStep);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;
  const hasErrors = stepErrors[currentStep]?.length > 0;

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit();
      resetWizard();
      navigate("/admin");
    } catch (error) {
      console.error("Failed to submit tour:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = async () => {
    if (isDirty) {
      const confirmed = await confirm({
        title: t("wizard.leaveTitle"),
        message: t("wizard.leaveConfirm"),
        confirmText: t("wizard.leaveLeave"),
        cancelText: t("wizard.leaveStay"),
        variant: "warning",
      });
      if (!confirmed) return;
    }
    resetWizard();
    navigate("/admin");
  };

  return (
    <div className="fixed inset-0 bg-stone-50 z-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden lg:block w-80 flex-shrink-0"
      >
        <WizardSidebar />
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button className="lg:hidden p-2 hover:bg-stone-100 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Step info */}
            <div>
              <p className="text-xs font-medium text-emerald-600 tracking-wide uppercase">
                {t("wizard.stepOf")
                  .replace("{current}", String(currentStep))
                  .replace("{total}", "5")}
              </p>
              <h1
                className="text-xl font-semibold text-slate-900"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {currentStepInfo && t(currentStepInfo.titleKey)}
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                {t("wizard.unsavedChanges")}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              {t("wizard.close")}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Error Display */}
            <AnimatePresence>
              {hasErrors && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-sm font-medium text-red-800 mb-2">
                    {t("wizard.fixErrors")}
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {stepErrors[currentStep].map((error, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <StepRenderer />
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="flex items-center justify-between px-6 py-4 bg-white border-t border-stone-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className={cn(isFirstStep && "invisible")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("wizard.previous")}
          </Button>

          <div className="flex items-center gap-2">
            {/* Step indicators (mobile) */}
            <div className="flex items-center gap-1.5 lg:hidden">
              {WIZARD_STEPS.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    step.id === currentStep
                      ? "bg-emerald-500"
                      : step.id < currentStep
                        ? "bg-emerald-300"
                        : "bg-stone-300",
                  )}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className={cn(
              "bg-emerald-600 hover:bg-emerald-700 text-white",
              isLastStep && "bg-emerald-600 hover:bg-emerald-700",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("wizard.saving")}
              </>
            ) : isLastStep ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t("wizard.publish")}
              </>
            ) : (
              <>
                {t("wizard.continue")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </footer>
      </main>
    </div>
  );
};

export default TourWizardLayout;
