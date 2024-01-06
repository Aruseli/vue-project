<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const src = ref('src/assets/flags/gb.svg');
  const language = ref('English');
/*
- китайский,
- английский,
- русский,
- украинский,
- тайский,
- немецкий,
- испанский,
- иврит
*/
</script>

<template>
  <div @click="router.push('catalog')" class="row justify-start items-center lang_container">
    <q-img :src="src" :alt="language" max-width="100%" max-height="100%" width="16rem" height="9rem" ratio="16/9" class="q-mr-xl" />
    <div class="text-h1 text-center text-white text-uppercase">{{ language }}</div>
  </div>
</template>

<style>
.lang_container {
  width: 60vw
}
</style>
