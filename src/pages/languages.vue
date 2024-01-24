<script setup>
  import Logo from 'src/components/logo/logo.vue';
  import language from 'src/components/language.vue';
import LogoSvgWhite from 'src/components/logo/logo-svg-white.vue';
</script>

<template>
  <q-page class="column justify-center items-center relative bg-secondary window-height">
    <Logo class="logo_row logo" classes="q-mr-md">
      <LogoSvgWhite />
    </Logo>
    <div class="column bg-primary container">
      <language />
      <language />
      <language />
      <language />
      <language />
      <language />
      <language />
      <language />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.logo {
  padding: 5rem;
  position: absolute;
  top: 0;
  left: 0;
}
.container {
  width: max-content;
  padding: 4rem;
  border-radius: 1rem;
}
.container > *:not(:last-child) {
  margin-bottom: 4rem;
}
</style>
