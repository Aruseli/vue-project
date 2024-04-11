<script setup>
const props = defineProps({
  imgContainer: {
    type: String,
    default: ''
  },
  text_style: {
    type: String,
    default: ''
  },
})

</script>

<template>
  <div v-bind="$attrs" class="row items-center">
    <div class="q-mr-sm">
      <slot></slot>
    </div>
    <div class="text-h3 text-center text-secondary text-uppercase text-weight-bold q-mr-sm" :class="props.text_style">high case</div>
  </div>
</template>
