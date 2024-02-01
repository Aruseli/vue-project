import { KioskState, LocaleInfo } from "src/types/kiosk-state";
import { apiGetLocale, apiGetLocalesList } from "./api";
import { delay } from "./utils";
import i18next from 'i18next';

export async function updateCatalogLocales(kioskState: KioskState, i18n: any) {
  // Update locales
  while (true) {
    try {
      const lang_codes = await apiGetLocalesList(kioskState.params!.object_id!, kioskState.params!.location_id!)
        .then(r => r?.map(l => l?.lang_code))
      console.log('catalog_locales', lang_codes);
      kioskState.catalogLocales = await prepareLocales(lang_codes)
      await Promise.all(lang_codes.map(async (lc) => {
        const locale = await apiGetLocale(lc)
        console.log('lc, locale', lc, locale)
        i18next.addResourceBundle(lc, "translation", locale, true, true);
      }))
      break
    } catch {
    }
    await delay(1000)
  }
}

export const KNOWN_LOCALES: LocaleInfo[] = [
  {
    locale: 'en',
    flag: 'src/assets/flags/gb.webp',
    language: 'English',
  },
  {
    locale: 'th',
    flag: 'src/assets/flags/th.webp',
    language: 'Thai',
  },
  {
    locale: 'ru',
    flag: 'src/assets/flags/ru.webp',
    language: 'Russian',
  },
  {
    locale: 'de',
    flag: 'src/assets/flags/de.webp',
    language: 'German',
  },
  {
    locale: 'es',
    flag: 'src/assets/flags/es.webp',
    language: 'Spanish',
  },
  {
    locale: 'uk',
    flag: 'src/assets/flags/ua.webp',
    language: 'Ukrainian',
  },
];

export async function prepareLocales(lang_codes: string[]) {
  const langcodesSet = new Set(lang_codes)
  return KNOWN_LOCALES.filter(l => langcodesSet.has(l.locale))
}
