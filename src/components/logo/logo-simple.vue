<script setup>
const props = defineProps({
  classes: {
    type: String,
    default: 'q-mr-sm'
  }
})

</script>

<template>
  <div v-bind="$attrs" class="row items-center">
    <div :class="classes">
      <slot></slot>
    </div>
    <div class="text-h3 text-center text-secondary">
      <span class="text-uppercase text-weight-bold">herb</span><span class="text-uppercase text-weight-thin">point</span>
    </div>
  </div>
</template>
