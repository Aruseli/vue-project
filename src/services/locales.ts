import { KioskState, LocaleInfo } from "src/types/kiosk-state";
import { apiGetLocale, apiGetLocalesList } from "./api";
import { delay } from "./utils";
import i18next from 'i18next';

export async function updateCatalogLocales(kioskState: KioskState) {
  // Update locales
  while (true) {
    try {
      const locales = await apiGetLocalesList(kioskState.params!.object_id!, kioskState.params!.location_id!)
        .then(r => r?.map(l => ({
          lang_code: l?.lang_code,
          name: l?.name,
          flag_src: `/flags/${l.flag_code}.webp` })))
          console.log({locales})
      kioskState.catalogLocales = locales;
      await Promise.all(locales.map(async (lc) => {
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
//     lang_code: 'en',
//     flag_src: 'src/assets/flags/gb.webp',
//     name: 'English',
//   },
//   {
//     lang_code: 'th',
//     flag_src: 'src/assets/flags/th.webp',
//     name: 'Thai',
//   },
//   {
//     lang_code: 'ru',
//     flag_src: 'src/assets/flags/ru.webp',
//     name: 'Russian',
//   },
//   {
//     lang_code: 'km',
//     flag_src: 'src/assets/flags/de.webp',
//     name: "Cambodia",
//   },
//   {
//     lang_code: 'es',
//     flag_src: 'src/assets/flags/es.webp',
//     name: 'Spanish',
//   },
//   {
//     lang_code: 'uk',
//     flag_src: 'src/assets/flags/ua.webp',
//     name: 'Ukrainian',
//   },
// ];

// export async function prepareLocales(lang_codes: string[]) {
//   const langcodesSet = new Set(lang_codes)
//   return KNOWN_LOCALES.filter(l => langcodesSet.has(l.locale))
// }
