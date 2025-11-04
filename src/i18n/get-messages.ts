import type { Locale } from './routing';

export async function getMessages(locale: Locale) {
  const messages = await import(`../messages/${locale}.json`).then(m => m.default);
  return messages as Record<string, any>;
}
