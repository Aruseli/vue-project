<script setup lang="ts">
const props = defineProps({
  currentSlide: {
    type: Number,
    default: 0
  },
  navCarousel: {
    type: String,
    default: 'column',
  },
})
</script>

<template>
  <div class="carousel" :class="props.navCarousel">
    <slot />
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.nav_container {
  height: 20rem;
  width: 100%;
  overflow: hidden;
}
</style>

