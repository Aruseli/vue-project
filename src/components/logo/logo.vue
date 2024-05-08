<script setup>

const props = defineProps({
  classes: {
    type: String,
  }
})

</script>

<template>
  <div v-bind="$attrs">
    <div class="img_container" :class="props.classes">
      <slot></slot>
    </div>
    <div class="text-h1 text-center text-white text-uppercase">
      <div>high case</div>
      <div class="text-h3 text-weight-thin">find your experience</div>
    </div>
  </div>
</template>

<style scoped>
.img_container {
  width: 10rem;
}
</style>
