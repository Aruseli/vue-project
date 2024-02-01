<script setup>
  import { t } from 'i18next';
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
    }
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
   <q-btn :size="size" unelevated rounded :color="color" :text-color="textColor" @click="click" v-bind="$attrs">{{ props.name }}</q-btn>
</template>

<style scoped>
button {
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.25);
}
</style>
