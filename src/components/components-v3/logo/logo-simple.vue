<script setup>
const props = defineProps({
  classes: {
    type: String,
    default: 'q-mr-sm'
  },
  text_style: {
    type: String,
    default: 'q-mr-sm'
  },
})

</script>

<template>
  <div v-bind="$attrs" class="row items-center">
    <div :class="props.classes">
      <slot></slot>
    </div>
    <div class="text-h3 text-center text-secondary text-uppercase text-weight-bold" :class="props.text_style">high case</div>
  </div>
</template>
