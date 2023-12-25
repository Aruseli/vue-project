import { defineStore } from 'pinia';
import { ref } from 'vue';

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
  const drawerCartState = ref(false);
  const tab = ref('food');

  const openDrawerCart = (state) => {
    drawerCartState.value = state;
    console.log('drawerCartState', drawerCartState.value);
  }

  return {
    drawerCartState,
    tab,
    openDrawerCart,
  }
});
