import React from "react";
import { motion } from "framer-motion";
import { LANGUAGES } from "../types";
import { useTourWizardStore } from "../hooks/useTourWizardStore";
import { cn } from "@/lib/utils";

interface LanguageTabsProps {
  className?: string;
}

export const LanguageTabs: React.FC<LanguageTabsProps> = ({ className }) => {
  const { activeLanguage, setActiveLanguage } = useTourWizardStore();

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 bg-slate-100 rounded-lg",
        className,
      )}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setActiveLanguage(lang.code)}
          className={cn(
            "relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            activeLanguage === lang.code
              ? "text-slate-900"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          {activeLanguage === lang.code && (
            <motion.div
              layoutId="activeLanguageTab"
              className="absolute inset-0 bg-white rounded-md shadow-sm"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{lang.flag}</span>
          <span className="relative z-10 hidden sm:inline">
            {lang.code.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
};

// Compact version for inline use
export const LanguageTabsCompact: React.FC<LanguageTabsProps> = ({
  className,
}) => {
  const { activeLanguage, setActiveLanguage } = useTourWizardStore();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-md",
        className,
      )}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setActiveLanguage(lang.code)}
          className={cn(
            "relative px-2 py-1 rounded text-xs font-medium transition-colors",
            activeLanguage === lang.code
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};
