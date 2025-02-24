const diacriticsRegex = /[\u0300-\u036f]/g;

/**
 * Removes diacritics and accents from the given text.
 * Example: 'México' -> 'Mexico'
 * @param text - The text to be normalized.
 * @returns Text without diacritics.
 */
export const removeDiacritics = (text: string = ''): string => {
  return text.normalize('NFD').replace(diacriticsRegex, '');
};
