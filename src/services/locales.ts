import { KioskState, LocaleInfo } from "src/types/kiosk-state";
import { apiGetLocale, apiGetLocalesList } from "./api";
import { delay } from "./utils";
import i18next from 'i18next';


export async function prepareLocales(lang_codes: LocaleInfo[]) {
  const locales = lang_codes.map(language => {
    return {
      ...language,
      src: `/flags/${language.lang_code}.webp`,
    };
  });
  return locales
}
export async function updateCatalogLocales(kioskState: KioskState) {
  // Update locales
  while (true) {
    try {
      const lang_codes = await apiGetLocalesList(kioskState.params!.object_id!, kioskState.params!.location_id!)
        .then(r => r?.map(l => ({
          lang_code: l?.lang_code,
          name: l?.name,
          flag_src: `/flags/${l.lang_code}.webp` })))
      console.log('kioskState.params!.object_id!', kioskState.params);
      kioskState.catalogLocales = lang_codes;
      await Promise.all(lang_codes.map(async (lc) => {
        const locale = await apiGetLocale(lc.lang_code)
        i18next.addResourceBundle(lc.lang_code, "global", locale, true, false);
      }))
      break
    } catch {
    }
    await delay(1000)
  }
}

// export const KNOWN_LOCALES: LocaleInfo[] = [
//   {
//     locale: 'en',
//     flag: 'src/assets/flags/gb.webp',
//     language: 'English',
//   },
//   {
//     locale: 'th',
//     flag: 'src/assets/flags/th.webp',
//     language: 'Thai',
//   },
//   {
//     locale: 'ru',
//     flag: 'src/assets/flags/ru.webp',
//     language: 'Russian',
//   },
//   {
//     locale: 'km',
//     flag: 'src/assets/flags/de.webp',
//     language: "Cambodia",
//   },
//   {
//     locale: 'es',
//     flag: 'src/assets/flags/es.webp',
//     language: 'Spanish',
//   },
//   {
//     locale: 'uk',
//     flag: 'src/assets/flags/ua.webp',
//     language: 'Ukrainian',
//   },
// ];

// export async function prepareLocales(lang_codes: string[]) {
//   const langcodesSet = new Set(lang_codes)
//   return KNOWN_LOCALES.filter(l => langcodesSet.has(l.locale))
// }
