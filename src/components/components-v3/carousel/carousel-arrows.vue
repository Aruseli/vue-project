<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  carousel_arrow_right: {
    type: String,
    default: '',
  },
  carousel_arrow_left: {
    type: String,
    default: '',
  },
});

const scrollContainer = ref<HTMLElement>();
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

const updateArrowsVisibility = () => {
  if (scrollContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
    showLeftArrow.value = scrollLeft > 0;
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth;
  }
};

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -scrollContainer.value.clientWidth,
      behavior: 'smooth',
    });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: scrollContainer.value.clientWidth,
      behavior: 'smooth',
    });
  }
};

onMounted(() => {
  updateArrowsVisibility();
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateArrowsVisibility);
    window.addEventListener('resize', updateArrowsVisibility);
  }
});

</script>

<template>
  <div class="slider_navigation_container relative-position">
    <transition name="arrow_animation">
      <div
        class="absolute carousel_arrow_left bg-grey-3 flex items-center justify-center"
        :class="props.carousel_arrow_left"
        v-show="showLeftArrow"
        @click="scrollLeft"
      >
        <q-icon name="navigate_before" color="white" size="2rem" />
      </div>
    </transition>
    <div class="scroll_slides" ref="scrollContainer">
      <slot />
    </div>
    <transition name="arrow_animation">
      <div
        class="absolute carousel_arrow_right bg-grey-3 flex items-center justify-center"
        :class="props.carousel_arrow_right"
        v-show="showRightArrow"
        @click="scrollRight"
      >
        <q-icon name="navigate_next" color="white" size="2rem" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slider_navigation_container {
  overflow: hidden;
  height: auto;
}
.scroll_slides {
  overflow-x: scroll;
  display: flex;
  scroll-padding-inline: 1rem;
  scroll-snap-type: x mandatory;
  scrollbar-gutter: stable both-edges;
  column-gap: 1.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;  /* IE 10+ */
}
.carousel_arrow_right {
  position: absolute;
  top: 0;
  right: 0;
  width: 2rem;
  height: 100%;
}
.carousel_arrow_left {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 2rem;
  height: 100%;
}
.arrow_animation-enter-active,
.arrow_animation-leave-active {
  transition: all 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.arrow_animation-leave-to,
.arrow_animation-enter-from {
  opacity: 0;
}
</style>
