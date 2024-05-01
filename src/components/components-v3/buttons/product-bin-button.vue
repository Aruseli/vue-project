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
  <btn class="relative-position bin_button_style" @click.stop="emit('click')">
    <slot></slot>
  </btn>
</template>


<style scoped lang="scss">
  .bin_button_style {
    border-radius: 2rem;
    border: thin solid green;
    width: 2rem;
    height: 2rem;
  }
</style>
