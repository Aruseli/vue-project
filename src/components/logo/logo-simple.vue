<script setup lang="ts">
import { useAppStore } from 'src/stores/app';

const app = useAppStore();
const props = defineProps({
  imgContainer: {
    type: String,
    default: ''
  },
  text_style: {
    type: String,
    default: ''
  },
})

</script>

<template>
  <div v-bind="$attrs" class="row items-center">
    <div class="q-mr-sm">
      <slot></slot>
    </div>
    <div class="text-h2 text-center text-secondary text-uppercase text-weight-bold q-mr-sm" :class="props.text_style">high case</div>
  </div>
</template>
