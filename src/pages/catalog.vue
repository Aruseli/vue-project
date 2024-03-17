<script setup>
import CatalogHeader from '../components/catalog/catalog-header.vue';
import CatalogNew from '../components/catalog/catalog-new.vue';
import Catalog from '../components/catalog/catalog.vue';
import Tabs from '../components/catalog/catalog-category/tabs.vue';
import { useAppStore } from 'src/stores/app';

  const app = useAppStore();

</script>

<template>
  <q-page :style="{ direction: app.lang_dir }" class="flex align-center relative justify-start window-full">
    <CatalogHeader />
    <div v-if="app.kioskState.settings?.alt_ui" class="row catalog_container">
      <Tabs />
      <CatalogNew />
    </div>
    <Catalog v-else />
  </q-page>
</template>

<style scoped>
.catalog_container {
  width: 100%;
  padding: 0 2rem;
  column-gap: 2rem;
  margin-top: 4rem;
  @media (max-width: 1300px) {
    margin-top: 2.125rem;
    padding: 0 1rem;
    column-gap: 1rem;
  }
}
</style>

