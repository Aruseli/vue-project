import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { Router } from 'vue-router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  pinia.use(({ store }) => {
    store.$subscribe((mutation, state) => {
      localStorage.setItem(store.$id, JSON.stringify(state));
    });

    const stateJson = localStorage.getItem(store.$id);
    if (stateJson) {
      store.$state = JSON.parse(stateJson);
    }
  });

  return pinia;
});
