<script setup>
  import Logo from 'src/components/logo/logo.vue';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import LogoSvgWhite from 'src/components/logo/logo-svg-white.vue';

  const router = useRouter();
  const show = ref(true);
</script>

<template>
  <q-page class="flex flex-center relative relative-position">
    <div class="bg_filtered" />
    <div class="column justify-between window-height full-width container" @click="router.push('languages')">
      <Logo class="logo_row self-start" classes="q-mr-md">
        <LogoSvgWhite />
      </Logo>

      <Transition name="slide-fade" mode="out-in">
          <p v-show="show" class="text-h1 text-center text-white text-uppercase">
            {{ $t('find_your_experience') }}
          </p>
        </Transition>
      <div class="column">
        <div class="text-h4 text-center text-grey-2 text-uppercase">
          {{ $t('tap_on_screen') }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.bg_filtered {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/start.jpg');
  background-position: center;
  filter: brightness(0.6);
}
.container {
  padding: 5rem;
  z-index: 2;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter-active {
  transition: all 3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(30px);
  opacity: 0;
}

</style>
