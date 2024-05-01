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
  <q-btn unelevated class="relative-position btn_style" @click="emit('click')">
    <slot></slot>
    <div
      v-if="props.quantity > 0"
      class="badge_style bg-positive flex items-center justify-center" :class="props.badgeStyleAlt"
    >
      <div class="text-subtitle1 text-white text_style">{{ props.quantity }}</div>
    </div>
  </q-btn>
</template>


<style scoped>
.btn_style {
  width: max-content;
  padding: 0px;
  height: max-content;
}
.badge_style {
  position: absolute;
  bottom: 0rem;
  left: -0.2rem;
  border-radius: 1.25rem;
  min-width: 1.25rem;
  width: max-content;
  height: 1.25rem;
}
.text_style {
  align-self: end;
}
</style>
