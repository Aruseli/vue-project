<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps({
  quantity: {
    type: Number,
    default: 0
  }
})

</script>

<template>
  <q-btn unelevated round class="relative-position" @click="emit('click')">
    <slot></slot>
    <div v-if="props.quantity > 0" class="badge_style bg-positive flex items-center justify-center">
      <div class="text-h5 text-white">{{ props.quantity }}</div>
    </div>
  </q-btn>
</template>


<style scoped>
.badge_style {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  border-radius: 2.5rem;
  min-width: 3.5rem;
  width: max-content;
  height: 3.5rem;
  @media (max-width: 1300px) {
    min-width: 2.5rem;
    height: 2.5rem;
    bottom: 1rem;
    left: 1rem;
  }
}
</style>
