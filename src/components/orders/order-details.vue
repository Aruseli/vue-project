<script setup>
  import DividerThin from '../dividers/divider-thin.vue';
  import DividerBold from '../dividers/divider-bold.vue';
  import OrderCard from './order-card.vue';
  import { ref, watch } from 'vue';
  import { useOrdersStore } from 'src/stores/orders';
  import { useRouter, useRoute } from 'vue-router';
  import { t } from 'i18next';
  import { onMounted } from 'vue';
  import { computed } from 'vue';

  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();

  const confirmOrder = async () => {
    await ordersStore.confirmCurrentOrderIssue()
    router.push('/issued-order');
  }

  const allowClickScan = ref(process.env.DEV);

  const allowConfirm = computed(() => {
    return ordersStore.currentOrder?.items?.every(i => i.issued == i.quant)
  });

  onMounted(async () => {
    try {
      await ordersStore.selectOrder(route.params.id)
    } catch (err) {
      console.error('ordersStore.selectOrder error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_order'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })
  console.log('ordersStore.currentOrder?.items', ordersStore.currentOrder?.items)
</script>

<template>
  <div class="main_container full-height">
    <div class="relative-position">
      <router-link :to="{ path: '/issuing-order' }" class='router_link_style text-secondary absolute-top-left'>
        {{ t('back_to_order_list') }}
      </router-link>
      <div class="text-h1 text-uppercase text-center q-mb-md title_padding">{{ t('order') }}&ensp;№{{ ordersStore.currentOrder?.orderNumStr }}</div>
    <DividerThin class="q-mb-xl bg-secondary" />
    </div>
    <div class="scroll_area">
      <div class="orders_container">
        <OrderCard
          v-for="order in ordersStore.currentOrder?.items"
          :key="order.id"
          :good_title="order.title"
          :good_price="order.price"
          :good_quant="order.quant"
          :good_src="order.image.image"
          :good_issued="order.issued"
          :id="order.id"
          @click="() => {
            if (allowClickScan) {
              order.issued += 1;
            }
          }"
        />
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h4">{{ t('total') }}</div>
        <div class="text-h3 q-mb-md">
          {{ ordersStore.currentOrder?.totalPrice }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-lg" />
        <div class="text-h4 order_container text-weight-regular">
          <span>{{ t('order') }}</span>&ensp;
          <span>{{ ordersStore.currentOrder?.totalCount }}</span>&ensp;
          <span>{{ t('product') }}</span>
          <span>{{ t('units', { count: ordersStore.currentOrder?.totalCount }) }}</span>
        </div>
      </div>
      <div class="full-width">
        <q-btn
          class="full-width text-style q-py-lg"
          unelevated
          rounded
          no-caps
          color="primary"
          @click="confirmOrder"
          :disable="!allowConfirm"
        >
          <div class="text-h3 text-white text-center text-weight-bold text-header_bg text-uppercase">
            {{ t('confirm') }}
          </div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_container {
  display: grid;
  grid-template-rows: max-content 1fr 0.1fr;
}
.scroll_area {
  overflow-y: scroll;
  padding: 0.5rem;
}
.orders_container > *:not(:last-of-type) {
  margin-bottom: var(--px30);
}
.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
</style>
