<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      required: false,
      default: 'confirm'
    },
    color: {
      type: String,
      default: 'grey-1',
    },
    textColor: {
      type: String,
      default: 'white',
    }
  })

  const emit = defineEmits(['click']);
</script>

<template>
  <q-btn
    :color="props.color"
    :text-color="props.textColor"
    class="pa-10 full-width text-uppercase text-body1 text-weight-bold"
    v-bind="$attrs"
    @click="emit('click')"
  >
    {{ $t(props.name) }}
  </q-btn>
</template>

<style scoped>
button {
  border-radius: var(--border-xxs);
  transition: all 0.5s ease-in-out;
}
</style>
