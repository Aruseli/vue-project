<script setup lang="ts">
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
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    iconStyle: {
      type: String,
      default: '',
    }
  })

  const emit = defineEmits(['click']);
</script>

<template>
   <q-btn
    unelevated
    :rounded="rounded"
    :round="round"
    :flat="flat"
    :disable="props.disable"
    :color="props.color"
    :text-color="props.textColor"
    v-bind="$attrs"
    @click="emit('click')"
  >
    <slot></slot>
    <q-icon flat :color="props.textColor" :size="props.size" :name="props.icon" v-if="!props.customIcon" :class="props.iconStyle"></q-icon>
   </q-btn>
</template>

<style scoped>
.q-icon {
  font-size: 4rem !important;
}
</style>
