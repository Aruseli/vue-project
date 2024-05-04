<script setup lang="ts">
  import Logo from 'src/components/logo/logo.vue';
  import { useRouter } from 'vue-router';
  import { Ref, onMounted, onUnmounted, ref } from 'vue';
  import LogoSvg from 'src/components/logo/logo-svg.vue';
  import { useAppStore } from 'src/stores/app';
  import { forceNewVisit } from 'src/services/tracking';

  const router = useRouter();
  const show = ref(true);
  const shiftsUpdateTimer = ref<number | null>(null);
  const app = useAppStore();

  const onClick = async () => {
    forceNewVisit();
    await router.push('languages');
  }

  const updateShifts = async () => {
    await app.updateShifts();
    if (!app.shiftIsGood) {
      await app.lockTerminal();
    }

    const pollingIsActive = shiftsUpdateTimer.value !== null;
    if (pollingIsActive) {
      clearTimeout(shiftsUpdateTimer.value  as number);

      const intervalAvg = app.kioskState.settings?.shifts__poll_interval_average_ms ?? 600000;
      const intervalVar = app.kioskState.settings?.shifts__poll_interval_variance_ms ?? 120000;
      const nextTick = intervalAvg + intervalVar * (2 * Math.random() - 1);
      shiftsUpdateTimer.value = setTimeout(updateShifts, nextTick)  as unknown as number;
    }
  }

  onMounted(() => {
    forceNewVisit();
    app.resetLocale();
    shiftsUpdateTimer.value = setTimeout(updateShifts, 0)  as unknown as number;
  })
  onUnmounted(() => {
    clearTimeout(shiftsUpdateTimer.value  as number);
    shiftsUpdateTimer.value = null;
  })

</script>

<template>
  <q-page class="flex flex-center relative relative-position">

    <div class="video_wrapper" v-if="app.kioskState.settings?.alt_ui === 'design_v3'">
      <video playsinline autoplay muted loop>
        <source src="flame.mp4" type="video/mp4">
      </video>
      <div class="hello_text" @click="onClick">
        <div class="column justify-center items-center text-center container_text mb-120">
          <q-icon color="white" name="img:/cta.svg" class="handIconStyle" />
          <div class="text-white text-h1 text-uppercase title_styles">{{ $t('find_your_experience') }}</div>
        </div>
      </div>
    </div>

    <div v-if="app.kioskState.settings?.alt_ui !== 'design_v3'">
      <div class="bg_filtered" />
      <div class="column justify-between window-height full-width container" @click="onClick">
        <Logo class="logo_row self-start" classes="q-mr-sm img_style">
          <LogoSvg fill="#FAFAFA" />
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
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: brightness(0.6);
}
.container {
  padding: 5rem;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: 899px) {
    padding: 1.5rem;
  }
}

.video_wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.video_wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hello_text {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.container_text {
  width: min-content;
}
.handIconStyle {
  font-size: clamp(7rem, 7vw + 1rem, 13rem);
}
</style>
