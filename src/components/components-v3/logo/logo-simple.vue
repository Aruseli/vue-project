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
    <div :class="props.classes">
      <slot></slot>
    </div>
    <div class="text-h3 text-center text-secondary">
      <span class="text-uppercase text-weight-bold">high</span><span class="text-uppercase text-weight-thin">case</span>
    </div>
  </div>
</template>
