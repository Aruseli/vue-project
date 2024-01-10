import { defineStore } from 'pinia';
import { watch, ref, computed } from 'vue';

// TODO: product => good
/*
 Хранит:
 - каталог товаров с изображениями, ценами и остатками

 Точки общения с API:
 - получение каталога
 - обновление (получение с сервера) остатков
 */

export const useGoodsStore = defineStore('goodsStoreOld',
  () => {
    const goods = ref([]);

    // const updateGoods = async() => {
    //   // TODO: Transform product to a kiosk friendly format
    //   const response = await fetch('https://dummyjson.com/products');
    //   const data = await response.json();
    //   goods.value = data.products;
    // }

    const updateGoods = () => {
      fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            goods.value = data.products;
        })
        .catch(error => console.error('Error:', error));
    }

    return {
      goods,
      updateGoods,
    }
  },
  // {
  //   persist: true,
  // },
)

