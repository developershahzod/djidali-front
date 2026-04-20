import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const TestModeBanner: React.FC = () => {
  const { translate } = useLanguage();

  const message = translate({
    ru: "Сайт работает в тестовом режиме — возможны временные неполадки и изменения в контенте",
    uz: "Sayt sinov rejimida ishlamoqda — vaqtinchalik nosozliklar va kontent oʻzgarishlari boʻlishi mumkin",
    en: "The site is running in test mode — temporary issues and content changes may occur",
    de: "Die Website befindet sich im Testmodus — vorübergehende Störungen und Inhaltsänderungen sind möglich",
  });

  const items = Array.from({ length: 6 });

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[60] h-8 overflow-hidden border-b border-amber-500/40 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-[12px] font-semibold tracking-wide text-amber-950 shadow-[0_1px_0_rgba(0,0,0,0.05)]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-amber-400 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-amber-400 to-transparent" />

      <div className="flex h-full whitespace-nowrap animate-marquee will-change-transform">
        {items.map((_, i) => (
          <div
            key={`a-${i}`}
            className="flex items-center gap-2 px-6 h-full shrink-0"
            aria-hidden={i !== 0}
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="uppercase">{message}</span>
            <span className="opacity-50">•</span>
          </div>
        ))}
        {items.map((_, i) => (
          <div
            key={`b-${i}`}
            className="flex items-center gap-2 px-6 h-full shrink-0"
            aria-hidden
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="uppercase">{message}</span>
            <span className="opacity-50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestModeBanner;
