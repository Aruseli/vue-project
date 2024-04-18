<script setup lang="ts">
const props = defineProps({
  image: {
    type: Object,
  },
  addedSlide: {
    type: String,
  },
  currentImage: {
    type: Object,
  }
})

const emit = defineEmits(['click']);
</script>

<template>
  <div class="slide_container" @click="emit('click')" v-bind="$attrs">
    <transition name="slide_animation">
      <slot name="slide" />
    </transition>
    <slot name="angles" />
  </div>
</template>

<style>
.slide_container {
  width: 100%;
  height: 100%;
}
.slide_animation-enter-active,
.slide_animation-leave-active {
  transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.slide_animation-leave-to,
.slide_animation-enter-from {
  opacity: 0;
  transform: translateY(100%);
}


</style>
