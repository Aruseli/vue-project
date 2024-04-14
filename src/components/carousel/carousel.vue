<script setup lang="ts">
const props = defineProps({
  navCarousel: {
    type: String,
    default: 'column',
  },
})
</script>

<template>
  <div class="carousel" :class="props.navCarousel">
    <slot name="slides" />
  </div>
</template>

<style scoped>
.carousel {
  display: flex;
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

