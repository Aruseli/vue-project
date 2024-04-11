<script setup>
  import { useAppStore } from '../../../stores/app.ts';

  const app = useAppStore();
  const props = defineProps({
    src: {
      type: String,
      default: 'src/assets/flags/gb.webp'
    },
    alt: {
      type: String,
      default: 'english'
    },
    language: {
      type: String,
      default: 'English'
    },
  })

  const emit = defineEmits(['click']);

</script>

<template>
  <div
    @click="emit('click')"
    class="lang_container_new justify-center items-center"
    :class="[app.kioskState.settings?.alt_ui == 'design_v3' ? 'row' : 'column']"
  >
    <q-img
      :src="props.src"
      :alt="props.alt"
      ratio="16/9"
      class="img_style q-mb-xs"
      fit='fill'
    />
    <div
      class="text-left text-uppercase lang_style"
      :class="[app.kioskState.settings?.alt_ui == 'design_v3' ? 'text-white text-h2 q-ml-sm' : 'text-black text-h5']"
    >{{ props.language }}</div>
  </div>
</template>

<style scoped lang="scss">
$width: calc(6.5em + 1.7262vmin);
.img_style {
  height: $width;
  width: $width;
  border-radius: 50%;
  box-shadow: var(--border-shadow);
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
