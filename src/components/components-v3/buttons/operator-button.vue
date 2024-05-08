<script setup lang="ts">
import { PropType } from 'vue';
  const props = defineProps({
    icon: {
      type: String,
      default: 'evaPlusOutline',
    },
    color: {
      type: String,
      default: 'transparent',
    },
    textColor: {
      type: String,
      default: 'white',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  })
  console.log('disable', props.disabled)

  const emit = defineEmits(['click']);
</script>

<template>
  <q-btn
    unelevated
    :color="props.color"
    :text-color="props.textColor"
    v-bind="$attrs"
    :disable="props.disabled"
    @click.stop="emit('click')"
    :class="[props.disabled? 'disable_class' : '']"
  >
    <q-icon flat :color="props.textColor" :name="props.icon" class="icon_size"></q-icon>
   </q-btn>
</template>

<style scoped>
 .icon_size {
    font-size: clamp(1rem, 1.5vw + 0.5rem, 2.5rem) !important;
  }
  .disable_class {
    filter: brightness(0.5);
  }
</style>
