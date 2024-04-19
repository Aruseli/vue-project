<script setup lang="ts">
  import i18next, { t } from 'i18next';
import { useQuasar } from 'quasar';
import DividerBold from 'src/components/dividers/divider-bold.vue';
import { useGoodsStore } from 'src/stores/goods';
import { useOrdersStore } from 'src/stores/orders';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../buttons/back-button.vue';
import ExistOrder from './exist-order.vue';

  const $q = useQuasar();
  const router = useRouter();
  const goodsStore = useGoodsStore();
  const ordersStore = useOrdersStore();

const goToOrder = (id: string) => {
  router.push({ path: "/issuing-order/order/" + id });
};

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language)
      await ordersStore.updateOrders()
    } catch (err) {
      console.error('ordersStore.updateOrders error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_orders'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })
</script>

<template>
  <div class="main_container full-height">
    <div class="row justify-center relative-position px-40 pt-40">
      <BackButton @click="router.push('/employee-actions')" class="absolute-top-left" />
      <div
        class="text-h2 text-uppercase text-center"
      >{{ $t('open_orders') }}</div>
    </div>
    <DividerBold class="mb-60"/>
    <div class="exist_orders_container px-40">
      <ExistOrder
        v-for="order in ordersStore.orders"
        :key="order.id"
        :good_title="order.allTitles"
        :good_price="order.totalPrice"
        :order_number="order.orderNumStr"
        @click="goToOrder(order.id)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_container {
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  overflow-y: scroll;

  scrollbar-width: none;
  background-color: white;
}

.exist_orders_container > *:not(:last-of-type) {
  margin-bottom: var(--px30);
}
</style>
