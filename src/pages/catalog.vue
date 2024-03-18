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
    <!-- <div v-if="app.altUI === true" class="row catalog_container">
      <Tabs /> -->
    <CatalogNew v-if="app.altUI == true" />
    <!-- </div> -->
    <Catalog v-if="app.altUI == false" />
  </q-page>
</template>

<style scoped>

</style>

