import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { Router } from 'vue-router';
// import { watch } from 'vue';
// import createPersistedState from 'pinia-plugin-persistedstate';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import _ from 'lodash';
// import { customSerializer } from '../converter';
// import { useCartStore } from './cart';

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

export default store((context) => {
  const pinia = createPinia();
//   const cartStore = useCartStore();
// //@ts-ignore
//   pinia.use(createPersistedState(null, { persist: ['cartStore'], serializer: customSerializer }));
console.log('context', context)

  pinia.use(piniaPluginPersistedstate);
  return pinia;
});
