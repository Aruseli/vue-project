<script setup>
  import Logo from 'src/components/logo.vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();
</script>

<template>
  <q-page class="flex flex-center relative bg-secondary">
    <div class="column justify-between window-height full-width container" @click="router.push('languages')">
      <Logo class="logo_row self-start" />
      <div class="text-h1 text-center text-white text-uppercase">
        find your experience
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}
</style>
