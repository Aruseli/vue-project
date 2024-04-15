<script setup>
  import Logo from '../components/logo/logo.vue';
  import language from '../components/language.vue';
  import LogoSvg from '../components/logo/logo-svg.vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from 'src/stores/app';
  import { useGoodsStore } from 'src/stores/goods';

  const app = useAppStore();
  const goodsStore = useGoodsStore();

  const router = useRouter();
  const changeLanguage = async (newLocale) => {
    await goodsStore.updateGoods(newLocale);
    app.setLocale(newLocale);
    router.push('catalog');
    localStorage.setItem('lang', newLocale);
    if (app.kioskState.settings?.alt_ui == 'design_v3') {
      document.body.className = 'v3_body_style'
    }
  }

</script>

<template>
  <q-page class="column justify-center items-center relative hello_bg window-height">
    <Logo class="logo_row logo" classes="q-mr-sm">
      <LogoSvg fill="#FAFAFA" />
    </Logo>
    <div class="bg-primary container_languages">
      <language v-for="lang in app.kioskState.catalogLocales"
        :key="lang.lang_code"
        :src="lang.flag_src"
        :alt="lang.name"
        :language="lang.lang_code"
        @click="changeLanguage(lang.lang_code)"
      />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.logo {
  padding: 5rem;
  position: absolute;
  top: 0;
  left: 0;

  @media (max-width: 2050px) and (orientation: landscape) {
    padding: 2rem;
  }
  @media (max-width: 1300px) {
    padding: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
  @media (max-width: 770px) {
    padding: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
.hello_bg {
  background-image: url('/start.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
