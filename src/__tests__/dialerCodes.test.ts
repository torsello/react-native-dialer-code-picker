import { getDialerCodes } from '../constants/dialerCodes';

const LANGS = [
  'en',
  'da',
  'ru',
  'pl',
  'ua',
  'cz',
  'by',
  'pt',
  'es',
  'ro',
  'bg',
  'de',
  'fr',
  'nl',
  'it',
  'cn',
  'zh',
  'ko',
  'ee',
  'jp',
  'he',
  'el',
  'ar',
  'tr',
  'hu',
] as const;

const codes = getDialerCodes();
const byCode = (code: string) => codes.find((c) => c.code === code);
const flagOf = (code: string) =>
  [...code]
    .map((ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65))
    .join('');

describe('dialerCodes.json', () => {
  it('has unique ISO 3166-1 alpha-2 codes', () => {
    const all = codes.map((c) => c.code);
    expect(all.every((c) => /^[A-Z]{2}$/.test(c))).toBe(true);
    expect(new Set(all).size).toBe(all.length);
  });

  it('has well-formed dial codes', () => {
    const bad = codes.filter((c) => !/^\+\d{1,4}$/.test(c.dial_code));
    expect(bad.map((c) => c.code)).toEqual([]);
  });

  it('has a flag matching each code', () => {
    const bad = codes.filter((c) => c.flag !== flagOf(c.code));
    expect(bad.map((c) => c.code)).toEqual([]);
  });

  it('has a name in every supported language', () => {
    const missing = codes.flatMap((c) =>
      LANGS.filter((l) => !c.name[l]?.trim()).map((l) => `${c.code}.${l}`)
    );
    expect(missing).toEqual([]);
  });

  it('does not give two countries the same name in a language', () => {
    const dupes: string[] = [];
    for (const l of LANGS) {
      const seen = new Map<string, string>();
      for (const c of codes) {
        const n = c.name[l]?.trim().toLowerCase();
        if (!n) continue;
        const other = seen.get(n);
        if (other) dupes.push(`${l}: ${other}/${c.code} "${n}"`);
        else seen.set(n, c.code);
      }
    }
    expect(dupes).toEqual([]);
  });

  it('does not list codes deleted from ISO 3166-1', () => {
    expect(byCode('AN')).toBeUndefined();
  });

  it.each([
    ['KY', '+1345'],
    ['GY', '+592'],
    ['PY', '+595'],
    ['SX', '+1721'],
    ['MF', '+590'],
    ['CW', '+599'],
    ['BQ', '+599'],
    ['SS', '+211'],
    ['XK', '+383'],
    ['VA', '+39'],
    ['PN', '+64'],
  ])('%s dials %s', (code, dial) => {
    expect(byCode(code)?.dial_code).toBe(dial);
  });
});
