<script setup>
import { ref } from 'vue';
import CatalogHeader from '../components/catalog/catalog-header.vue';
import Catalog from '../components/catalog/catalog.vue';
import Tabs from '../components/catalog/catalog-category/tabs.vue';
import { useAppStore } from 'src/stores/app';

  const scrollInfo = ref(true);
  const app = useAppStore();

  const onScroll = (...info) => {
    if(info[0].delta.top !== 0) {
      scrollInfo == true
    }
    return scrollInfo;
  }
</script>

<template>
  <q-page :style="{ direction: app.lang_dir }" class="flex align-center relative justify-start window-full">
    <CatalogHeader />
    <div v-if="app.altUI" class="row catalog_container">
      <Tabs />
      <Catalog />
    </div>
  </q-page>
</template>

<style scoped>
.catalog_container {
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

