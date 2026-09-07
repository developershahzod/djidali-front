import type { Language } from "../../contexts/LanguageContext";

/** A single rendered block of a legal document. */
export type LegalBlockType = "h2" | "h3" | "p" | "label" | "appendix";

export type LocalizedText = Record<Language, string>;

export type LegalBlock = LocalizedText & {
  type: LegalBlockType;
};

export type LegalDocument = {
  title: LocalizedText;
  blocks: LegalBlock[];
};
