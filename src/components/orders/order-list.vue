<script setup>
  import DividerThin from '../dividers/divider-thin.vue';
  import ExistOrder from './exist-order.vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { t } from 'i18next';
  import i18next  from 'i18next';
  import { useGoodsStore } from 'src/stores/goods';
  import { useOrdersStore } from 'src/stores/orders';
  import { useQuasar } from 'quasar';
  import RectangularButton from '../buttons/rectangular-button.vue';

  const $q = useQuasar();
  const router = useRouter();
  const goodsStore = useGoodsStore();
  const ordersStore = useOrdersStore();

  const goToOrder = (id) => {
    router.push({ path: '/issuing-order/order/' + id })
  }

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
    console.log('goodsStore', goodsStore.goods)
  })
</script>

<template>
  <div class="main_container full-height">
    <div class="relative-position">
      <RectangularButton
        :name="$t('back_to_employee_actions')"
        color="secondary"
        icon="arrow_back_ios_new"
        class="q-pr-sm"
        @click="router.push('/employee-actions')"
      />

      <div
        class="
          text-h2 text-uppercase text-center
          q-mb-lg-lg
          q-mb-xs-sm
          q-pt-sm-sm
          q-pt-xs-sm
        "
      >{{ $t('open_orders') }}</div>
      <DividerThin class="q-mb-lg-lg q-mb-xs-sm bg-secondary" />
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

  scrollbar-width: none;
  padding: 3.75rem;
  @media (max-width: 1300px) {
    padding: 1.5rem;
  }
  @media (max-width: 899px) {
    padding: 1rem;
  }
}

.orders_container > *:not(:last-child) {
  margin-bottom: var(--px30);
}
.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
</style>
