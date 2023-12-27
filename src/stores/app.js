import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCartStore } from './cart';

/*
 This is 'app' or 'main' store.
 Предназнечение - хранить глобальные данные для приложения:
 - визуальные состояния при необходимости (например, cartDrawerState)
 - локализации интерфейса
 - может быть, в будущем сессии пользователей (если будут вложенные сессии авторизации)

 Здесь же подключается локализация по умолчанию.

 На этапе разработки вместо fetch использовать Promise.resolve(SOME_CONSTANT)
 с комментарием "//TODO fetch"
 */

export const useAppStore = defineStore('app', () => {
  const cartStore = useCartStore();
  const drawerCartState = ref(false);
  const orderDialog = ref(false);
  const tab = ref('food');
  const tabCharacteristics = ref('description');

  const openDrawerCart = (state) => {
    drawerCartState.value = state;
  }

  const openOrderDialog = (state) => {
    orderDialog.value = state;
    cartStore.clearCart();
  }

  return {
    drawerCartState,
    tab,
    tabCharacteristics,
    openDrawerCart,
    orderDialog,
    openOrderDialog,
  }
});
