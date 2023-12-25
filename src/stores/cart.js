import { defineStore } from 'pinia';
import { watch, ref, computed } from 'vue';
import { useGoodsStore } from './products';

/*
  Хранит корзину

  Точки общения с API:
  - создание нового пустого заказа
  - изменение строчки заказа
  - подтверждение заказа (= нажатие кнопки Order)

  NOTE:
  In CAT we have Order in state "Draft" for cart and Order in state "Active" since "pending payment" state of cart
*/
export const useCartStore = defineStore('cartStore',
  () => {
    const cart = ref([]);

    const addToCart = (good) => {
      const existingGood = cart.value.find(item => item.id === good.id);
      if (existingGood) {
        existingGood.count++;
        existingGood.price += good.price;
      } else {
        cart.value.push({
          id: good.id,
          title: good.title,
          price: good.price,
          images: [...good.images],
          alt: good.title,
          description: good.description,
          lineTotal: good.price,
          count: 1,
        })
      }
    }

    const increaseItemsCount = (good) => {
      let existingGood = cart.value.find(item => item.id === good.id) || null;
      if (existingGood) {
        existingGood.count++;
        existingGood.price = good.price + existingGood.price;
      }
    }

    const decreaseItemsCount = (good) => {
      let existingGood = cart.value.find(item => item.id === good.id) || null;
      if (existingGood) {
        existingGood.count--;
        existingGood.price = existingGood.price - good.price;
      }
      if ( existingGood.count == 0 ) cart.value = cart.value.filter(item => item.id !== good.id);
    };

    return {
      cart,
      increaseItemsCount,
      decreaseItemsCount,
      addToCart,
    }
  },
  {
    persist: true,
  },

);


