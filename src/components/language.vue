<script setup>

  const props = defineProps({
    src: {
      type: String,
      default: 'src/assets/flags/gb.webp'
    },
    language: {
      type: String,
      default: 'English'
    },
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }

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
  <div @click="click" class="row justify-start items-center lang_container">
    <q-img
      :src="src"
      :alt="language"
      max-width="100%"
      max-height="100%"
      width="13rem" height="7rem"
      ratio="16/9"
      class="q-mr-xl"
      fit='fill'
    />
    <div class="text-h3 text-center text-white text-uppercase">{{ language }}</div>
  </div>
</template>

<style>
.lang_container {
  width: 60vw
}
</style>
