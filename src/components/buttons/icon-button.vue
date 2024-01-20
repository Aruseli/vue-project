<script setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const props = defineProps({
    icon: {
      type: String,
    },
    size: {
      type: String,
      required: false,
      default: 'xl'
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
  const click = () => {
    emit('click')
  }
</script>

<template>
   <q-btn
    unelevated
    rounded
    :color="color"
    :text-color="textColor"
    v-bind="$attrs"
    @click="click">
    <q-icon flat :color="textColor" :size="size" :name="icon" />
   </q-btn>
</template>

<style scoped>
</style>
