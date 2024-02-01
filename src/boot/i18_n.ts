import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

// Type-define 'en' as the master schema for the resource
export type MessageSchema = typeof messages['en'];


declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en', // запасная локаль
  legacy: false,
  globalInjection: true,
  messages: messages,
  pluralizationRules: {
    'en': (choice, choicesLength) => {
      // два варианта: единственное и множественное число
      if (choice === 1) {
        return 0; // (e.g. 1 piece)
      } else {
        return 1; // (e.g. 0 pieces, 2 pieces, etc...)
      }
    },
    // ru: "нет штук | {n} штука | {n} штуки | {n} штук"
    'ru': (choice, choicesLength) => {
      // Это правило для русского языка
      if (choice === 0) {
        return 0; // нет штук
      }

      const endsWithTeen = (choice % 100) > 10 && (choice % 100) < 20;
      const endsWithOne = choice % 10 === 1;

      if (!endsWithTeen && endsWithOne) {
        return 1; // 1 штука
      }

      if (!endsWithTeen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2; // 2-4 штуки
      }

      // 5-20 штук, также заканчивается на "0, 5-9"
      return (choicesLength < 4) ? 2 : 3;
    }
  },
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n }
