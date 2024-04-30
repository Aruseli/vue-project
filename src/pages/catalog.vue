<script setup lang="ts">
import CatalogHeader from '../components/catalog/catalog-header.vue';
import CatalogV3 from '../components/components-v3/catalog-v3.vue';
import CatalogNew from '../components/catalog/catalog-new.vue';
import Catalog from '../components/catalog/catalog.vue';
import { useAppStore } from 'src/stores/app';
import CartDrawer from '../components/catalog/cart/cart-drawer.vue';

  const app = useAppStore();

</script>

<template>
  <q-page :style="{ direction: app.lang_dir }" class="flex align-center relative justify-start window-full">
    <CartDrawer v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
    <CatalogHeader v-if="app.kioskState.settings?.alt_ui == 'design_v1'" />
    <Catalog v-if="app.kioskState.settings?.alt_ui == 'design_v1'" />
    <CatalogNew v-if="app.kioskState.settings?.alt_ui == 'design_v2'" />
    <CatalogV3  v-if="app.kioskState.settings?.alt_ui == 'design_v3'" />
  </q-page>
</template>

<style scoped>
main {
  background: #181818
}
</style>

