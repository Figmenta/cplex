import { translations } from "./translations";
import { isValidLocale, DEFAULT_LOCALE } from "./constants";

/**
 * Server-side translation utility
 * Can be used directly in Server Components
 */
export async function useTranslations(locale: string) {
  // Validate locale or use default
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  
  // Return a function that gets translations from the specified locale
  return function translate(key: string, params?: Record<string, string>) {
    // Type assertion to tell TypeScript that validLocale and key are valid
    let text = translations[validLocale as keyof typeof translations][key as keyof typeof translations[keyof typeof translations]] || key;
    
    // Handle interpolation if params are provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    
    return text;
  };
}