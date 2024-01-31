import { KioskState, LocaleInfo } from "src/types/kiosk-state";
import { apiGetLocale, apiGetLocalesList } from "./api";
import { delay } from "./utils";
import { useI18n } from "vue-i18n";

export async function updateCatalogLocales(kioskState: KioskState, i18n: ReturnType<typeof useI18n>) {
  // Update locales
  while (true) {
    try {
      const langcodes = await apiGetLocalesList(kioskState.params!.object_id!, kioskState.params!.location_id!)
        .then(r => r?.map(l => l?.langcode))
      console.log('catalog_locales', langcodes);
      kioskState.catalogLocales = await prepareLocales(langcodes)
      await Promise.all(langcodes.map(async (lc) => {
        const locale = await apiGetLocale(lc)
        console.log(lc, locale)
        i18n.setLocaleMessage(lc, locale)
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

export async function prepareLocales(langcodes: string[]) {
  const langcodesSet = new Set(langcodes)
  return KNOWN_LOCALES.filter(l => langcodesSet.has(l.locale))
}
