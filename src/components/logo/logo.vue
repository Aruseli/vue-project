<script setup>

const props = defineProps({
  classes: {
    type: String,
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <div :class="classes">
      <slot></slot>
    </div>
    <div class="text-h2 text-center text-white">
      <span class="text-uppercase">herb</span><span class="text-uppercase text-weight-light">point</span>
      <div class="text-body1 text-weight-thin">find your experience</div>
    </div>
  </div>
</template>

<style scoped>
.lang_style {
  font-size: 3rem;
  @media (max-width: 2050px) and (orientation: landscape) {
    font-size: 1.5rem;
  }
}
</style>

