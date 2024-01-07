import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCartStore } from './cart';

export const useOrderStore = defineStore('orderStore',
  () => {
    const orders = ref([]);

    const cartStore = useCartStore();
    const existOrder = () => {
      // Создаем новый массив для хранения объектов нового заказа
      const newOrderRef = ref([]);
      let order_num = ref(1);

      // Заполняем новый массив объектами нового заказа
      for (const item of cartStore.cart) {
        newOrderRef.value.push({
          id: item.id,
          title: item.title,
          price: item.price,
          count: item.count,
          src: item.images[0],
        });
      }

      // Получаем общую стоимость одного заказа
      const totalCost = newOrderRef.value.reduce((acc, item) => acc + item.price, 0);

      // Получаем общее количество единиц продуктов в заказе
      const totalCount = newOrderRef.value.reduce((acc, item) => acc + item.count, 0);

      // Получаем наименования продуктов в заказе
      const allTitles = newOrderRef.value.reduce((acc, item) => {
        acc.push(item.title);
        return acc;
      }, []).join(", ");

      // Создаем номер заказа
      const orderNum = orders.value.length + 1;
       // Конвертируем номер заказа в строку
       const orderNumStr = String(orderNum);

      // Создаем новый массив заказа
      const newOrder = {
        ...newOrderRef.value,
        totalCost,
        totalCount,
        allTitles,
        orderNumStr,
      };

      // Добавляем новый массив в массив заказов
      orders.value.push(newOrder);
    };

    return {
      orders,
      existOrder,
    }
  },
  {
    persist: true,
  },

);


