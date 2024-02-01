import { boot } from 'quasar/wrappers';
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import Vue, { createApp } from 'vue';
import App from '../App.vue';

import en from '../i18n/index';

const i18n = i18next.init({
  debug: true,
  partialBundledLanguages: true,
  lng: 'default',
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'en',
  resources: en
});

const app = createApp(App);
// app.use(i18n)
app.use(I18NextVue, { i18next });
app.mount('#app');
export { i18n };

console.log(i18next.languages);
