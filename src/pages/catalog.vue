<script setup>
import { ref } from 'vue';
import CatalogHeader from '../components/catalog/catalog-header.vue';
import Catalog from '../components/catalog/catalog.vue';

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
    <CatalogHeader />
    <Catalog />
  </q-page>
</template>

