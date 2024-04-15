<script setup lang="ts">
const props = defineProps({
  image: {
    type: Object,
  },
  addedSlide: {
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
        v-show="props.image"
      >
        <template #loading>
          <div class="text-subtitle1 text-black">
            Loading...
          </div>
        </template>
      </q-img>
    </transition>
    <slot name="angles" />
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
