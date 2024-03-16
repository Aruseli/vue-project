<script setup>
  const props = defineProps({
    name: {
      type: String,
      required: false,
      default: 'open_shift'
    },
    size: {
      type: String,
      required: false,
      default: 'calc(2rem + 0.6vmax)'
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
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
   <q-btn :size="size" unelevated rounded :color="color" :text-color="textColor" @click="click" v-bind="$attrs" :disable="disable">{{ props.name }}
    <slot></slot>
   </q-btn>
</template>

<style scoped>
button {
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.25);
}
</style>
