<script setup lang="ts">
const props = defineProps({
  image: {
    type: Object,
  },
  addedSlide: {
    type: String,
  },
  angleTop: {
    type: String,
  },
  angleBottom: {
    type: String,
  },
})

const emit = defineEmits(['click']);
</script>

<template>
  <div class="slide_container relative-position" :class="props.addedSlide" @click="emit('click')">
    <transition name="slide">
      <q-img
        :src="props.image?.image"
        width="100%"
        height="100%"
        :ratio="1"
        class="slide_img"
      >
        <template #loading>
          <div class="text-subtitle1 text-black">
            Loading...
          </div>
        </template>
      </q-img>
    </transition>
    <div class="absolute-top-right img_angle_top" :class="props.angleTop" />
    <div class="absolute-bottom-left img_angle_bottom" :class="props.angleBottom" />
  </div>
</template>

<style>
.slide_container {
  width: 100%;
  height: 100%;
}
.slide_img {
  border-radius: 0 !important;
  scale: 0.9;
}
</style>
