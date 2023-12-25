import { defineStore } from 'pinia';
import { watch, ref, computed } from 'vue';
import { useProductsStore } from './product-store';

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref([]);

  const productsInLocalStorage = localStorage.getItem('cart');
  if(productsInLocalStorage) {
    cart.value = JSON.parse(productsInLocalStorage)._value;
  }

  const increaseItemsCount = (product) => {
    let existingProduct = cart.value.find(item => item.id === product.id) || null;
    if (existingProduct) {
      existingProduct.count++;
      existingProduct.price = product.price + existingProduct.price;
    }
  }

  const decreaseItemsCount = (product) => {
    let existingProduct = cart.value.find(item => item.id === product.id) || null;
    if (existingProduct) {
      existingProduct.count--;
      existingProduct.price = existingProduct.price - product.price;
    }
    if ( existingProduct.count == 0 ) cart.value = cart.value.filter(item => item.id !== product.id);
  };

  watch(
    () => cart,
    (state) => {
      localStorage.setItem('cart', JSON.stringify(state));
    },
    { deep: true }
  );

  return {
    cart,
    increaseItemsCount,
    decreaseItemsCount,
  }
});


