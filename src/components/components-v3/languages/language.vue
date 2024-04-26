<script setup lang="ts">
  import { useAppStore } from '../../../stores/app';

  const app = useAppStore();
  const props = defineProps({
    src: {
      type: String,
      default: 'src/assets/flags/4x3/gb-eng.svg'
    },
    alt: {
      type: String,
      default: 'english'
    },
    language: {
      type: String,
      default: ''
    },
    newClass: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['click']);

</script>

<template>
  <div
    @click="emit('click')"
    class="lang_container_new justify-center items-center row"
  >
    <q-img
      :src="props.src"
      :alt="props.alt"
      ratio="16/9"
      class="img_style q-mb-xs"
      fit='fill'
      :class="props.newClass"
    />
    <div
      class="text-left text-uppercase lang_style text-white text-h2 q-ml-sm" v-if="!!props.language"
    >{{ props.language }}</div>
  </div>
</template>

<style scoped lang="scss">
$width: calc(6.5em + 1.7262vmin);
$height: calc(3.5em + 1.7262vmin);
.img_style {
  height: $height;
  width: $width;
  border-radius: var(--border-xxs);
  // border-radius: 50%;
  // box-shadow: var(--border-shadow);
  margin-top: 0.125em;
  margin-inline: 0.125em;
}
.lang_container_new {
  width: 100%;
}

.lang_style {
  @media (max-width: 1200px) and (orientation: landscape) {
    font-size: 1rem;
  }
  @media (max-width: 770px) {
    font-size: 1rem;
    font-weight: 400 !important;
  }
}

</style>
