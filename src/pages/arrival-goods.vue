<script setup lang="ts">
  import ArrivalGoods from '../components/arrival/arrival-goods.vue';
  import {default as ArrivalGoodsNew} from '../components/components-v3/arrival/arrival-goods.vue';
  import { useAppStore } from 'src/stores/app';

  const app = useAppStore();
</script>

<template>
  <q-page class="flex flex-center relative bg-white">
    <div class="column justify-center items-center window-height full-width">
      <ArrivalGoods v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
      <ArrivalGoodsNew v-if="app.kioskState.settings?.alt_ui === 'design_v3'" />
    </div>
  </q-page>
</template>

