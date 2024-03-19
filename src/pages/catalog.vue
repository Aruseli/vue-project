<script setup>
import CatalogHeader from '../components/catalog/catalog-header.vue';
import CatalogNew from '../components/catalog/catalog-new.vue';
import Catalog from '../components/catalog/catalog.vue';
import { useAppStore } from 'src/stores/app';

  const app = useAppStore();

</script>

<template>
  <q-page :style="{ direction: app.lang_dir }" class="flex align-center relative justify-start window-full">
    <CatalogHeader />
    <CatalogNew v-if="app.kioskState.settings?.alt_ui" />
    <Catalog v-else />
  </q-page>
</template>

<style scoped>

</style>

