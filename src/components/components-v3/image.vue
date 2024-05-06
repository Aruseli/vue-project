<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  src: {
    type: String
  },
  alt: {
    type: String
  }
})

const imageLoaded = ref(false);

const onImageLoaded = () => {
  imageLoaded.value = true;
};

const onImageError = () => {
  console.error('Ошибка при загрузке изображения.');
};
</script>

<template>
  <div class="img_block">
    <img
      class="img_style"
      :src="props.src"
      :alt="props.alt"
      @load="onImageLoaded" @error="onImageError" v-show="imageLoaded"
    >
    <div class="text-body1" v-show="!imageLoaded">Loading...</div>
  </div>
</template>

<style>
.img_block {
  border-radius: 0 !important;
  scale: 0.9;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img_style {
  width: 100%;
  height: 100%;
}
.image-loader .spinner {
  /* Стили для спиннера */
}
</style>
