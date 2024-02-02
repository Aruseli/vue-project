<script setup>
  import Logo from 'src/components/logo/logo.vue';
  import language from 'src/components/language.vue';
  import LogoSvgWhite from 'src/components/logo/logo-svg-white.vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from 'src/stores/app';
  import { useGoodsStore } from 'src/stores/goods';
  import i18next from 'i18next';


  const app = useAppStore();
  const goodsStore = useGoodsStore();
  let locale = i18next.language;

  const router = useRouter();
  const changeLanguage = async (newLocale) => {
    console.log('locale', locale);
    await goodsStore.updateGoods(newLocale);
    app.setLocale(newLocale);
    router.push('catalog');
  }
console.log('app.kioskState.catalogLocales', app.kioskState.catalogLocales);
console.log('locale18', locale);

</script>

<template>
  <q-page class="column justify-center items-center relative bg-secondary window-height">
    <Logo class="logo_row logo" classes="q-mr-md">
      <LogoSvgWhite />
    </Logo>
    <div class="column bg-primary container">
      <language v-for="lang in app.kioskState.catalogLocales"
        :key="lang.lang_code"
        :src="lang.src"
        :alt="lang.name"
        :language="lang.name"
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
