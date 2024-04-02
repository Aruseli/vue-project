<script setup>
  const props = defineProps({
    icon: {
      type: String,
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
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
   <q-btn
    unelevated
    rounded
    :disable="props.disable"
    :color="props.color"
    :text-color="props.textColor"
    v-bind="$attrs"
    @click="click">
    <q-icon flat :color="props.textColor" :size="props.size" :name="props.icon"></q-icon>
   </q-btn>
</template>
