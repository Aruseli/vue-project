<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      required: false,
      default: 'open_shift'
    },
    size: {
      type: String,
      required: false,
      default: 'xs'
    },
    color: {
      type: String,
      required: false,
      default: 'primary'
    },
    textColor: {
      type: String,
      required: false,
      default: 'white'
    },
    disable: {
      type: Boolean,
      required: false,
      default: false
    },
    classTitle: {
      type: String,
      default: 'text-subtitle1',
    },
    rounded: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(['click']);
</script>

<template>
  <q-btn :size="props.size" unelevated
    :rounded="props.rounded"
    :color="props.color"
    :text-color="props.textColor"
    @click="emit('click')"
    v-bind="$attrs"
    :disable="props.disable"
  >
    <div :class="props.classTitle">{{ props.name }}</div>
    <slot></slot>
   </q-btn>
</template>

<style scoped>
button {
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.25);
}
</style>
