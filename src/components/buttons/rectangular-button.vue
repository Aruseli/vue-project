<script setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const props = defineProps({
    name: {
      type: String,
      required: false,
      default: 'open_shift'
    },
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
   <q-btn size="calc(2rem + 0.6vmax)" rounded class="bg-primary text-white" @click="click">{{ t(props.name) }}</q-btn>
</template>
