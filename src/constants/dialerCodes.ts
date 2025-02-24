import dialerCodes from './dialerCodes.json';

/**
 * Represents the country name in multiple languages.
 */
export interface CountryName {
  en: string;
  da?: string;
  ru?: string;
  pl?: string;
  ua?: string;
  cz?: string;
  by?: string;
  pt?: string;
  es?: string;
  ro?: string;
  bg?: string;
  de?: string;
  fr?: string;
  nl?: string;
  it?: string;
  cn?: string;
  zh?: string;
  ko?: string;
  ee?: string;
  jp?: string;
  he?: string;
  el?: string;
  ar?: string;
  tr?: string;
  hu?: string;
}

/**
 * Represents a dialer code entry.
 */
export interface DialerCode {
  name: CountryName;
  dial_code: string;
  code: string;
  flag: string;
}

export const getDialerCodes = (): DialerCode[] => {
  return dialerCodes;
};
