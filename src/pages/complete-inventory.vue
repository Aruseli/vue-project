<script setup>
  import CompleteInventory from '../components/inventory/complete-inventory.vue';
  import ArrivalGoods from '../components/arrival/arrival-goods.vue';
  import {default as CompleteInventoryNew} from '../components/components-v3/inventory/complete-inventory.vue';
  import { useAppStore } from 'src/stores/app';

  const app = useAppStore();
</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width">
      <CompleteInventory v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
      <CompleteInventoryNew v-if="app.kioskState.settings?.alt_ui === 'design_v3'" />
    </div>
  </q-page>
</template>

