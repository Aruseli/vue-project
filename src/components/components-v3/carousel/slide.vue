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
  },
  dot_slide: {
    type: Boolean,
    default: false,
  },
  activeState: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['click']);
</script>

<template>
  <div
    v-bind="$attrs"
    class="slide_container"
    :class="[(props.dot_slide == true) && (props.activeState == false) ? 'slide_filter' : '']"
    @click="emit('click')"
  >
    <transition name="slide_animation">
      <slot name="slide" />
    </transition>
    <div
      class="absolute-top-right"
      :class="[
        (props.dot_slide && props.activeState)
        ? 'slide_img_angle_top__active'
        : (props.dot_slide == false)
        ? 'img_angle_top'
        : (props.dot_slide && !props.activeState)
        ? 'slide_img_angle_top'
        : ''
      ]"
    />
    <div
      class="absolute-bottom-left"
      :class="[
       (props.dot_slide && props.activeState)
        ? 'slide_img_angle_bottom__active'
        : (props.dot_slide == false)
        ? 'img_angle_bottom'
        : (props.dot_slide && !props.activeState)
        ? 'slide_img_angle_bottom'
        : ''
      ]"
    />
  </div>
</template>

<style scoped lang="scss">
.slide_container {
  width: max-content;
  height: max-content;
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
.carousel_img {
  width: 25rem;
  height: 25rem;
}
.slide_filter {
 filter: brightness(0.5);
}
</style>
