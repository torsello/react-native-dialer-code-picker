import { CountryName } from '../constants/dialerCodes';

/**
 * Retrieves the country name in the specified language or falls back to English ('en').
 * If neither is available, it returns an empty string.
 * @param name - The object containing country names in multiple languages.
 * @param lang - The desired language code (optional).
 * @returns The country name in the specified language, in English, or an empty string.
 */
export const getCountryName = (
  name?: CountryName,
  lang?: keyof CountryName
): string => {
  if (!name || !lang) return '';

  // Try the specified language first
  if (name[lang]) return name[lang] as string;

  // Fallback to English ('en') if the specified language is not found
  if (name.en) return name.en;

  // If no name is available in any language, return an empty string
  return '';
};
