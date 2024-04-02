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

</script>

<template>
  <div @click="click" class="lang_container column justify-center items-center">
    <q-img
      :src="src"
      :alt="language"
      ratio="16/9"
      class="img_style"
      fit='fill'
    />
    <div class="text-left text-white text-uppercase text-h5 lang_style">{{ language }}</div>
  </div>
</template>

<style scoped lang="scss">
$width: calc(6.5em + 1.7262vmin);
.img_style {
  height: calc(100% - 3em);
  width: $width;
}
.lang_container {
  height: 100%;
  width: 100%;
}

.lang_style {
  @media (max-width: 1200px) and (orientation: landscape) {
    font-size: 1rem;
  }
  @media (max-width: 770px) {
    font-size: 1rem;
    font-weight: 400 !important;
  }
}

</style>
