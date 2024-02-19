<script setup>

  const props = defineProps({
    src: {
      type: String,
      default: 'src/assets/flags/gb.webp'
    },
    language: {
      type: String,
      default: 'English'
    },
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }

</script>

<template>
  <div @click="click" class="row justify-start items-center lang_container">
    <q-img
      :src="src"
      :alt="language"
      max-width="100%"
      max-height="100%"
      ratio="16/9"
      class="q-mr-xl img_style"
      fit='fill'
    />
    <div class="text-center text-white text-uppercase lang_style">{{ language }}</div>
  </div>
</template>

<style scoped>
.img_style {
  width: 13rem;
  height: 7rem;
  border-radius: 1.5rem;

  @media (max-width: 2050px) and (orientation: landscape) {
    width: 5rem;
    height: 3.5rem;
    border-radius: 0.5rem;
  }
}
.lang_container {
  width: 60vw;

  @media (max-width: 2050px) and (orientation: landscape) {
    width: 40vw;
  }
}

.lang_style {
  font-size: 3rem;
  @media (max-width: 2050px) and (orientation: landscape) {
    font-size: 1.5rem;
  }
}
</style>
