<script setup>
  import SelectiveInventory from '../components/inventory/selective-inventory.vue';
  import {default as SelectiveInventoryNew} from '../components/components-v3/inventory/selective-inventory.vue';
  import { useAppStore } from 'src/stores/app';

const app = useAppStore();

</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width">
      <SelectiveInventory v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
      <SelectiveInventoryNew v-if="app.kioskState.settings?.alt_ui === 'design_v3'" />
    </div>
  </q-page>
</template>
