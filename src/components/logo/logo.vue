<script setup>
const props = defineProps({
  classes: {
    type: String,
    default: 'q-mb-md'
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <div :class="classes">
      <slot></slot>
    </div>
    <div class="text-h3 text-center text-white">
      <span class="text-uppercase">herb</span><span class="text-uppercase text-weight-light">point</span>
      <div class="text-subtitle1 text-weight-thin">find your experience</div>
    </div>
  </div>
</template>
