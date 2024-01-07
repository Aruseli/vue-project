<script setup>
  import OrderList from '../components/orders/order-list.vue';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useOrderStore } from 'src/stores/order';
  
  const orderStore = useOrderStore();
  const router = useRouter();
  const { t } = useI18n();

</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-between window-height full-width container">
      <OrderList />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}
</style>
