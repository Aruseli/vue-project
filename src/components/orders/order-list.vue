<script setup>
  import DividerThin from '../dividers/divider-thin.vue';
  import ExistOrder from './exist-order.vue';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useOrderStore } from 'src/stores/order'

  const router = useRouter();
  const { t } = useI18n();
  const orderStore = useOrderStore();
  // const order_num = ref([
  //   {order_num: '001'},
  //   {order_num: '002'},
  //   {order_num: '003'},
  //   {order_num: '004'},
  // ])

  const goToOrder = (id) => {
    router.push({ path: '/issuing-order/order/' + id })
  }

  onMounted(() => {
    console.log('orderStore', orderStore.orders);
  })
</script>

<template>
  <div>
    <div class="text-h1 text-uppercase text-center q-mb-md">{{ t('open_orders') }}</div>
    <DividerThin class="q-mb-xl bg-secondary" />
    <div class="orders_container">
      <ExistOrder 
        v-for="order in orderStore.orders" 
        :key="order.id" 
        :good_title="order.allTitles" 
        :good_price="order.totalCost" 
        :order_number="order.orderNumStr" 
        :good_id="order.orderNumStr" 
        @click="goToOrder(order.orderNumStr)" 
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}

.orders_container > *:not(:last-child) {
  margin-bottom: var(--px30);
}
</style>
