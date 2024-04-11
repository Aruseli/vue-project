<script setup lang="ts">
import CatalogHeader from '../components/catalog/catalog-header.vue';
import CatalogNew from '../components/catalog/catalog-new.vue';
import CatalogV3 from '../components/components-v3/catalog-v3.vue';
import Catalog from '../components/catalog/catalog.vue';
import { useAppStore } from 'src/stores/app';
import CartDrawer from '../components/catalog/cart/cart-drawer.vue';

  const app = useAppStore();

</script>

<template>
  <q-page :style="{ direction: app.lang_dir }" class="flex align-center relative justify-start window-full">
    <CartDrawer />
    <CatalogHeader v-if="app.kioskState.settings?.alt_ui == 'design_v1'"/>
    <!-- <CatalogNew v-if="app.kioskState.settings?.alt_ui == 'design_v2'" /> -->
    <Catalog v-if="app.kioskState.settings?.alt_ui == 'design_v1'" />
    <CatalogV3 v-else />
  </q-page>
</template>

<style scoped>

</style>

