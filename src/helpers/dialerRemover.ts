import { getDialerCodes, DialerCode } from '../constants/dialerCodes';

/**
 * Filters dialer codes by excluding specified countries.
 * @param excludedCountries - Array of country codes to be excluded (in uppercase).
 * @returns Array of DialerItem excluding the specified countries.
 */
export const dialerRemover = (
  excludedCountries: string[] = []
): DialerCode[] => {
  const allDialerCodes = getDialerCodes();
  return allDialerCodes.filter((dialer) => {
    return !excludedCountries.includes(dialer.code.toUpperCase());
  });
};
