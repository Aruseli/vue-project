<script setup>
  import OrderList from '../components/orders/order-list.vue';
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
  padding: 3.75rem;
  @media (max-width: 1300px) {
    padding: 1.5rem;
  }
  @media (max-width: 899px) {
    padding: 1rem;
  }
}
</style>
