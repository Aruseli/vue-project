<script setup>

const props = defineProps({
  classes: {
    type: String,
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <div :class="props.classes" class="img_container">
      <slot></slot>
    </div>
    <div class="text-h1 text-center text-white">
      <span class="text-uppercase">herb</span><span class="text-uppercase text-weight-light">point</span>
      <div class="text-body1 text-weight-thin">find your experience</div>
    </div>
  </div>
</template>

<style scoped>
.img_container {
  width: clamp(3rem, 4.7352rem + 3.3241vw, 13rem);
}
</style>
