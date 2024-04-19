<script setup lang="ts">
  const props = defineProps({
    icon: {
      type: String,
      default: 'evaPlusOutline',
    },
    color: {
      type: String,
      default: 'white',
    },
    textColor: {
      type: String,
      default: 'grey-1',
    },
  })

  const emit = defineEmits(['click']);
</script>

<template>
  <q-btn
    unelevated
    round
    :color="props.color"
    :text-color="props.textColor"
    v-bind="$attrs"
    @click="emit('click')"
  >
    <q-icon flat :color="props.textColor" :name="props.icon" class="icon_size"></q-icon>
   </q-btn>
</template>

<style scoped>
 .icon_size {
    font-size: clamp(1rem, 1.5vw + 0.5rem, 2.5rem) !important;
  }
</style>
