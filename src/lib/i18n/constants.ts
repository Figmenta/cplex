/**
 * Supported locales in the application
 */

export const LOCALES = ["en", "it"] as const;
export const SWITCHERLOCALES = ["en", "it"] as const;

/**
 * Type for supported locales
 */
export type Locale = (typeof LOCALES)[number];

/**
 * Default locale used when user preference can't be determined
 */
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Locale names for display purposes
 */

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  it: "Italian",
};

/**
 * Utility to check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}
