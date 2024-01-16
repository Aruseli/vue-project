<script setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
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
    }
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
   <q-btn :size="size" unelevated rounded  class="bg-primary text-white text-uppercase q-px-xl" v-bind="$attrs" @click="click">{{ t(props.name) }}</q-btn>
</template>

<style scoped>
button {
  box-shadow: var(--box-shadow--product_cart);
  border-radius: var(--border-md);
}
</style>
