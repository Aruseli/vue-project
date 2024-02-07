import { boot } from 'quasar/wrappers';
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import messages from '../i18n/index';


const i18n = i18next.init({
  debug: true,
  partialBundledLanguages: true,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'en',
  resources: {
    'en': messages,
  },
  ns: ['global'],
});

export default boot(({ app }) => {
  app.use(I18NextVue, { i18next });
});
