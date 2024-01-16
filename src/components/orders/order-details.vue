<script setup>
  import DividerThin from '../dividers/divider-thin.vue';
  import DividerBold from '../dividers/divider-bold.vue';
  import OrderCard from './order-card.vue';
  import { computed, onMounted, ref } from 'vue';
  import { useOrderStore } from 'src/stores/order';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const orderStore = useOrderStore();
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const selectedOrder = computed(() => {
    return orderStore.orders.find(order => order.orderNumStr === route.params.id);
  })

  // Получаем номер заказа, который был подтвержден
  const selectedOrderNum = selectedOrder.value.orderNumStr;

  const confirmedOrder = () => {
    router.push('/issued-order');
    // Удаляем заказ из массива заказов
    orderStore.orders.value.splice(orderStore.orders.value.indexOf(selectedOrderNum), 1);
  }

  const scannedItem = ref(false);
  const emulateScan = (id) => {
    const block = document.getElementById(id);
    let selectedItem = selectedOrder.value.items.find(item => item.id === id);
    if (selectedItem.id === id) {
      scannedItem.value = true;
      block.classList.remove('bg-white');
      block.classList.add('bg-positive');
    }
    console.log('selectedItem', selectedItem.id === id);
    console.log('block', block);
  }

</script>

<template>
  <div class="main_container full-height">
    <div class="relative-position">
      <router-link :to="{ path: '/issuing-order' }" class='router_link_style text-secondary absolute-top-left'>
        {{ t('back_to_order_list') }}
      </router-link>
      <div class="text-h1 text-uppercase text-center q-mb-md title_padding">{{ t('order') }}&ensp;№{{ selectedOrder.orderNumStr }}</div>
    <DividerThin class="q-mb-xl bg-secondary" />
    </div>
    <div class="scroll_area">
      <div class="orders_container">
        <OrderCard
          v-for="order in selectedOrder.items"
          :key="order.id"
          :good_title="order.title"
          :good_price="order.price"
          :good_quant="order.count"
          :good_src="order.src"
          :id="order.id"
          @click="() => {
            emulateScan(order.id);
            console.log('id', order.id)
          }"
          :scannedItem="scannedItem"
        />
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h4">{{t('total')}}</div>
        <div class="text-h3 q-mb-md">
          {{ selectedOrder.totalCost }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-lg" />
        <div class="text-h4 order_container text-weight-regular">
          <span>{{t('order')}}</span>&ensp;
          <span>{{ selectedOrder.totalCount }}</span>&ensp;
          <span>{{ t('product_units') }}</span>
        </div>
      </div>
      <div class="full-width">
        <q-btn
          class="full-width text-style q-py-lg"
          unelevated
          rounded
          no-caps
          color="primary"
          @click="confirmedOrder"
        >
          <div class="text-h3 text-white text-center text-weight-bold text-header_bg text-uppercase">
            {{ $t('confirm') }}
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
