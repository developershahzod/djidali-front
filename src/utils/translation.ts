/**
 * Safely gets translated text from a translation object or string
 * @param text - The text to translate (can be string or translation object)
 * @param language - The current language code
 * @returns The translated string or a fallback
 */
export const getTranslatedText = (
  text: string | { [key: string]: string } | undefined,
  language: string = 'en'
): string => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  
  // Try to get the text in the current language, fall back to English, then any available language
  return (
    text[language] ||
    text.en ||
    text.uz ||
    text.ru ||
    text.de ||
    Object.values(text)[0] ||
    ''
  );
};

/**
 * Creates a translation object with the given translations
 */
export const createTranslation = (translations: {
  en: string;
  [key: string]: string;
}) => translations;
