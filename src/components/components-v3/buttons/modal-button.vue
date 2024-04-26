<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      required: false,
      default: 'open_shift'
    },
    color: {
      type: String,
      required: false,
      default: 'grey-3'
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
      default: 'text-h3',
    },
  })

  const emit = defineEmits(['click']);
</script>

<template>
  <q-btn
    :color="props.color"
    :text-color="props.textColor"
    @click="emit('click')"
    v-bind="$attrs"
    :disable="props.disable"
    class="pa-20 full-width"
  >
    <div :class="props.classTitle">{{ props.name }}</div>
    <slot></slot>
   </q-btn>
</template>

<style scoped>
button {
  box-shadow: var(--border-shadow);
  border-radius: var(--border-xxs);
}
/* button.disabled {
  background-color: #5D5D5D;
} */
</style>
