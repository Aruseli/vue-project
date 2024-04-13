<script setup>
  const props = defineProps({
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      required: false,
      default: 'lg'
    },
    color: {
      type: String,
      default: 'primary',
    },
    textColor: {
      type: String,
      default: 'white',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    customIcon: {
      type: Boolean,
      default: false,
    }
  })

  const emit = defineEmits(['click']);
</script>

<template>
   <q-btn
    unelevated
    rounded
    :disable="props.disable"
    :color="props.color"
    :text-color="props.textColor"
    v-bind="$attrs"
    @click="emit('click')"
  >
    <slot></slot>
    <q-icon flat :color="props.textColor" :size="props.size" :name="props.icon" v-if="!customIcon"></q-icon>
   </q-btn>
</template>
