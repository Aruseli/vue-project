<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '10rem'
  },
  classes: {
    type: String,
    default: 'q-mb-lg'
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <q-img src="src/assets/logo.svg" max-width="100%" max-height="100%" :width="props.width" :class="classes" />
    <div class="text-h3 text-center text-white">
      <span class="text-uppercase">herb</span><span class="text-uppercase text-weight-light">point</span>
      <div class="text-subtitle1 text-weight-thin">find your experience</div>
    </div>
  </div>
</template>
