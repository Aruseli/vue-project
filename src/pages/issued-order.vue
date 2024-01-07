<script setup>
  import OrderList from '../components/orders/order-list.vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useOrderStore } from 'src/stores/order';
import DividerBold from 'src/components/dividers/divider-bold.vue';
import DividerThin from 'src/components/dividers/divider-thin.vue';
  
  const orderStore = useOrderStore();
  const router = useRouter();
  const { t } = useI18n();

</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-center items-center window-height full-width container">
      <div as="h1" class="text-h1 text-uppercase">{{ t('order_was_issued_successfully') }}</div>
      <DividerBold />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h4">{{t('total')}}</div>
        <div class="text-h3 q-mb-md">
          {{ orderStore.orders[0].totalCost }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-lg" />
        <div class="text-h4 order_container text-weight-regular">
          <span>{{t('order')}}</span>&ensp;
          <span>{{ orderStore.orders[0].totalCount }}</span>&ensp;
          <span>{{ t('product_units') }}</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}
</style>
