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
  <div class="main_container full-height">
    <div class="relative-position">
      <router-link :to="{ path: '/issuing-order' }" class='router_link_style text-secondary absolute-top-left'>
          {{ t('back_to_employee_actions') }}
      </router-link>
      <div class="text-h1 text-uppercase text-center q-mb-md title_padding">{{ t('open_orders') }}</div>
      <DividerThin class="q-mb-xl bg-secondary" />
    </div>
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
.main_container {
  display: grid;
  grid-template-rows: max-content 1fr;
  overflow-y: scroll;
  padding: 0.5rem;
}

.orders_container > *:not(:last-child) {
  margin-bottom: var(--px30);
}
.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
</style>
