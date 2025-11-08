// src/i18n/routing.ts
export const locales = ['ro','en','it'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'ro';
export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}
