<script setup>
  const props = defineProps({
    name: {
      type: String,
      required: false,
      default: 'confirm'
    },
    size: {
      type: String,
      required: false,
      default: 'calc(1rem + 0.3vmax)'
    },
    color: {
      type: String,
      default: 'primary',
    },
    textColor: {
      type: String,
      default: 'white',
    }
  })

  const emit = defineEmits(['click']);
</script>

<template>
   <q-btn :size="props.size" unelevated rounded :color="props.color" :text-color="props.textColor" class="text-uppercase q-px-md-sm q-px-xs-xs" v-bind="$attrs" @click="emit('click')">{{ $t(props.name) }}</q-btn>
</template>

<style scoped>
button {
  box-shadow: var(--box-shadow--product_cart);
  border-radius: var(--border-md);
  transition: all 0.5s ease-in-out;
}
</style>
