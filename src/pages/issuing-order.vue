<script setup>
  import OrderList from '../components/orders/order-list.vue';
  import {default as OrderListNew} from '../components/components-v3/orders/order-list.vue';
  import { useAppStore } from 'src/stores/app';

  const app= useAppStore();
</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-between window-height full-width container">
      <OrderList v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
      <OrderListNew v-if="app.kioskState.settings?.alt_ui === 'design_v3'" />
    </div>
  </q-page>
</template>
