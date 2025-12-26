import { useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const titles: Record<string, string> = {
  en: "DJIDALI - Ecological Tourism Service",
  ru: "DJIDALI - Сервис экологического туризма",
  uz: "DJIDALI - Ekologik turizm xizmati",
  de: "DJIDALI - Ökotourismus-Service",
};

export function useDocumentTitle() {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = titles[language] || titles.en;
  }, [language]);
}
