<script setup>
  import DividerThin from '../dividers/divider-thin.vue';
  import ExistOrder from './exist-order.vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useGoodsStore } from 'src/stores/goods';
  import { useOrdersStore } from 'src/stores/orders';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const router = useRouter();
  const i18n = useI18n();
  const { t } = i18n;
  const goodsStore = useGoodsStore();
  const ordersStore = useOrdersStore();

  const goToOrder = (id) => {
    router.push({ path: '/issuing-order/order/' + id })
  }

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18n.locale.value)
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
    <div class="relative-position">
      <router-link :to="{ path: '/employee-actions' }" class='router_link_style text-secondary absolute-top-left'>
        {{ $t('back_to_employee_actions') }}
      </router-link>
      <div class="text-h1 text-uppercase text-center q-mb-md title_padding">{{ $t('open_orders') }}</div>
      <DividerThin class="q-mb-xl bg-secondary" />
    </div>
    <div class="orders_container">
      <ExistOrder
        v-for="order in ordersStore.orders"
        :key="order.id"
        :good_title="order.allTitles"
        :good_price="order.totalPrice"
        :order_number="order.orderNumStr"
        :good_id="order.orderNumStr"
        @click="goToOrder(order.id)"
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
