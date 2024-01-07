<script setup>
  import OrderDetails from 'src/components/orders/order-details.vue';

  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-between window-height full-width container">
      <OrderDetails />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 1rem 5rem 5rem 5rem;
}
</style>
