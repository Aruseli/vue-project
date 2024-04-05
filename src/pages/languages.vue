<script setup>
  import Logo from 'src/components/logo/logo.vue';
  import language from 'src/components/language.vue';
  import LogoSvgWhite from 'src/components/logo/logo-svg-white.vue';
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
    localStorage.setItem('activeTab', app.tab);
  }

</script>

<template>
  <q-page class="column justify-center items-center relative hello_bg window-height">
    <Logo class="logo_row logo" classes="q-mr-sm">
      <LogoSvgWhite />
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
$width: calc(6.5em + 1.7262vmin);
$height: calc(8em + 1.7262vmin);
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
.container_languages {
  width: 80vw;
  display: grid;
  grid-template-columns: repeat( auto-fit, minmax($width, 1fr) );
  grid-auto-rows: minmax($height, 1fr);
  gap: 3rem;
  justify-content: center;
  padding: 3rem;
  border-radius: 1rem;
  overflow: hidden;
  @media (max-width: 900px) {
    gap: 2rem;
    padding: 2rem;
  }
}

.hello_bg {
  background-image: url('/start.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
