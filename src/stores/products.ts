import { defineStore } from 'pinia';
import { watch, ref, computed } from 'vue';
import { useCartStore } from './cart';

export const useProductsStore = defineStore('productsStore', () => {
  const products = ref([]);
  const drawerCartState = ref(false);
  const tab = ref('food');

  const getProducts = async() => {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    products.value = data.products;
  }

  const addToCartAndIncrementCount = (product) => {
    const cartStore = useCartStore();
    const existingProduct = cartStore.cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.count++;
      existingProduct.price += product.price;
    } else {
      cartStore.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        count: 1,
        images: [...product.images],
        alt: product.title,
        description: product.description
      });
    }
  }

  const openDrawerCart = (state) => {
    drawerCartState.value = state;
    console.log('drawerCartState', drawerCartState.value);
  }

  return {
    products,
    drawerCartState,
    tab,
    getProducts,
    addToCartAndIncrementCount,
    openDrawerCart,
  }
})

