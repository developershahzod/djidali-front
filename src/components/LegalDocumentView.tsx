import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import type { Language } from "../contexts/LanguageContext";
import ScrollToTopButton from "./ScrollToTopButton";
import type { LegalDocument } from "../data/legal/types";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

const LANGUAGE_OPTIONS: Language[] = ["ru", "uz", "en", "de"];

/** Slug used as the anchor id for a section heading. */
const anchorId = (index: number) => `section-${index}`;

/**
 * Renders a legal document (privacy policy, public offer) supplied by the
 * client as a .docx and converted into structured blocks. Layout is shared by
 * every legal page so they stay consistent on desktop and mobile.
 */
const LegalDocumentView: React.FC<LegalDocumentViewProps> = ({ document }) => {
  const { language, setLanguage, translate } = useLanguage();

  const title = document.title[language];

  // Top-level sections only - subsections would make the mobile list too long.
  const sections = useMemo(
    () =>
      document.blocks
        .map((block, index) => ({ block, index }))
        .filter(({ block }) => block.type === "h2"),
    [document],
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E0D5]">
        <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#8F7B49] hover:text-[#7a6839] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">
                {translate({
                  ru: "На главную",
                  uz: "Bosh sahifaga",
                  en: "Back to Home",
                  de: "Zur Startseite",
                })}
              </span>
            </Link>

            {/* These pages render without the site header, so the language
                switcher has to live here - the documents exist in 4 languages. */}
            <div className="flex items-center gap-1 shrink-0">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setLanguage(option)}
                  className={`px-2.5 py-1 rounded-md text-[13px] font-medium uppercase transition-colors ${
                    language === option
                      ? "bg-[#8F7B49] text-white"
                      : "text-[#767676] hover:bg-[#F0EDE4] hover:text-[#333333]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <h1
            className="text-[22px] md:text-[32px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#333333]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Table of contents */}
        <nav className="bg-white rounded-2xl p-5 md:p-7 shadow-sm mb-6">
          <p className="text-[13px] uppercase tracking-wide text-[#999999] mb-3">
            {translate({
              ru: "Содержание",
              uz: "Mundarija",
              en: "Contents",
              de: "Inhalt",
            })}
          </p>
          <ol className="space-y-2">
            {sections.map(({ block, index }) => (
              <li key={index}>
                <a
                  href={`#${anchorId(index)}`}
                  className="text-[14px] md:text-[15px] leading-snug text-[#8F7B49] hover:text-[#7a6839] hover:underline transition-colors"
                >
                  {block[language]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Document body */}
        <article className="bg-white rounded-2xl p-5 md:p-10 shadow-sm">
          {document.blocks.map((block, index) => {
            const text = block[language];

            if (block.type === "appendix") {
              return (
                <p
                  key={index}
                  className="text-[12px] md:text-[13px] uppercase tracking-wide text-[#8F7B49] mt-14 first:mt-0 mb-2 pt-10 first:pt-0 border-t first:border-t-0 border-[#E5E0D5]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {text}
                </p>
              );
            }

            if (block.type === "label") {
              return (
                <p
                  key={index}
                  className="text-[14px] md:text-[16px] leading-[1.7] font-semibold text-[#333333] mt-4 mb-1"
                >
                  {text}
                </p>
              );
            }

            if (block.type === "h2") {
              return (
                <h2
                  key={index}
                  id={anchorId(index)}
                  className="scroll-mt-6 text-[17px] md:text-[22px] font-semibold text-[#333333] mt-8 first:mt-0 mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {text}
                </h2>
              );
            }

            if (block.type === "h3") {
              return (
                <h3
                  key={index}
                  className="text-[15px] md:text-[18px] font-semibold text-[#333333] mt-6 mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {text}
                </h3>
              );
            }

            return (
              <p
                key={index}
                className="text-[14px] md:text-[16px] leading-[1.7] text-[#555555] mb-3 break-words"
              >
                {text}
              </p>
            );
          })}
        </article>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default LegalDocumentView;
