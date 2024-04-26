<script setup lang="ts">
const props = defineProps({
  disable: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['click']);
</script>
<template>
  <q-btn
    flat round
    :disable="props.disable"
    v-bind="$attrs"
    @click.stop="emit('click')"
  >
    <q-icon name="img:/bin.svg" class="text-grey-1 bin_size" />
  </q-btn>
</template>

<style scoped>
.bin_size {
  font-size: clamp(1.15rem, 1.3vw + 0.5rem, 1.5rem);
}
</style>
