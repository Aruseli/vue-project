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
  padding: 5rem;
}
</style>
