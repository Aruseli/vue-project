<script setup lang="ts">
const emit = defineEmits(['click']);
</script>
<template>
  <q-btn flat color="grey-1" icon="arrow_back_ios" label="Back" class="back_button_size" @click="emit('click')" />
</template>

<style scoped>
.back_button_size {
  font-size: clamp(1.15rem, 1.3vw + 0.5rem, 1.5rem);
  font-weight: bold;
}
</style>
