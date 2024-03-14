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
  <q-page class="flex align-center relative justify-start window-full">
    <CatalogHeader />
    <div v-if="app.altUI" class="row q-mt-md catalog_container">
      <Tabs />
      <Catalog />
    </div>
  </q-page>
</template>

<style scoped>
.catalog_container {
  padding: 0 2rem;
  column-gap: 2rem;
}
</style>

