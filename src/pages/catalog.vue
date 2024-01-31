<script setup>
  import Catalog from '../components/catalog/catalog.vue';
  import CatalogHeader from '../components/catalog/catalog-header.vue';
  import { reactive, ref } from 'vue';

  const scrollInfo = ref(true);

  const onScroll = (...info) => {
    if(info[0].delta.top !== 0) {
      scrollInfo == true
    }
    return scrollInfo;
  }

</script>

<template>
  <q-page class="flex flex-center relative" style="100%">
    <!-- <CartDrawer /> -->
    <q-scroll-observer @scroll="onScroll" />
    <CatalogHeader />
    <!-- <div style="height: 100px" /> -->
    <!-- <pre class="q-ma-none container">{{ scrollInfo }}</pre> -->
    <Catalog />
  </q-page>
</template>

<style scoped lang="scss">
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));
  $calc_gap: calc(1.875rem + var(--coefficient_gap));
  .q-toolbar {
    position: absolute;
    top: 0;
    justify-content: flex-end;
  }
  .cardHolder {
    width: 100%;
    height: 100%;
  }
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, $calc_width);
    gap: $calc_gap;
    width: 100%;
    height: 100%;
    padding: 0 3.75rem;
    justify-content: center;
  }
</style>
