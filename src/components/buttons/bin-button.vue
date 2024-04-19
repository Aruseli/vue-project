<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps({
  quantity: {
    type: Number,
    default: 0
  },
  badgeStyleAlt: {
    type: String,
  },
})

</script>

<template>
  <q-btn unelevated class="relative-position" @click="emit('click')">
    <slot></slot>
    <div
      v-if="props.quantity > 0"
      class="badge_style bg-positive flex items-center justify-center" :class="props.badgeStyleAlt"
    >
      <div class="text-h3 text-white">{{ props.quantity }}</div>
    </div>
  </q-btn>
</template>


<style scoped>
.badge_style {
  position: absolute;
  bottom: 0.5rem;
  left: -0.5rem;
  border-radius: 2.5rem;
  min-width: 2.5rem;
  width: max-content;
  height: 2.5rem;
  @media (min-width: 80rem) {
    min-width: 3rem;
    height: 3rem;
  }
}
</style>
