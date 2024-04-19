<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps({
  quantity: {
    type: Number,
    default: 0
  },
  badgeStyleAlt: {
    type: String,
  },
})

</script>

<template>
  <q-btn unelevated class="relative-position bin_button_style" @click="emit('click')">
    <slot></slot>
  </q-btn>
</template>


<style scoped lang="scss">
  .bin_button_style {
    border-radius: var(--px54);
    border: thin solid green;
    padding: 0.8em;
    min-width: 5rem;
    width: max-content;
    height: clamp(2rem, 4vw + 1rem, 5rem);
    @media (max-width: 80rem) {
      min-width: 2rem;
    }
  }
</style>
