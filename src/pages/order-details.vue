<script setup>
  import OrderDetails from 'src/components/orders/order-details.vue';
  import {default as OrderDetailsNew} from '../components/components-v3/orders/order-details.vue';
  import { useAppStore } from 'src/stores/app';

  const app= useAppStore();
</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-between window-height full-width container">
      <OrderDetails v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
      <OrderDetailsNew v-if="app.kioskState.settings?.alt_ui === 'design_v3'" />
    </div>
  </q-page>
</template>
