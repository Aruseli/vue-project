<script setup lang="ts">

  const props = defineProps({
    src: {
      type: String,
      default: 'src/assets/flags/4x3/gb-eng.svg'
    },
    alt: {
      type: String,
      default: 'English',
    },
    language: {
      type: String,
      default: 'English'
    },
    imgClasses: {
      type: String,
      default: '',
    }
  })

  const emit = defineEmits(['click']);
</script>

<template>
  <div @click="emit('click')" class="lang_container justify-center items-center" v-bind="$attrs">
    <q-img
      :src="props.src"
      :alt="props.alt"
      ratio="16/9"
      class="lang_img_style"
      :class="props.imgClasses"
      fit='fill'
    />
    <div class="text-left text-white text-uppercase text-h3 lang_title_style">{{ props.language }}</div>
  </div>
</template>

<style scoped lang="scss">
$width: calc(8.5em + 1.7262vmin);
$height: calc(5.5em + 1.7262vmin);
.lang_img_style {
  height: $height;
  width: $width;
}
.lang_container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.lang_title_style {
  @media (max-width: 1200px) and (orientation: landscape) {
    font-size: 1rem;
  }
  @media (max-width: 770px) {
    font-size: 1rem;
    font-weight: 400 !important;
  }
}

</style>
