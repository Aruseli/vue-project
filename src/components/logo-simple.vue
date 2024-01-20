<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '6.9rem'
  },
  classes: {
    type: String,
    default: 'q-mr-sm'
  }
})

</script>

<template>
  <div v-bind="$attrs" class="row items-center">
    <q-img src="src/assets/logo.svg" max-width="100%" max-height="100%" :width="props.width" :class="classes" />
    <div class="text-h3 text-center text-secondary">
      <span class="text-uppercase text-weight-bold">herb</span><span class="text-uppercase text-weight-thin">point</span>
    </div>
  </div>
</template>
