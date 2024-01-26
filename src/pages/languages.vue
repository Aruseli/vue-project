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

  const languages = [
    {
      locale: 'en',
      flag: 'src/assets/flags/gb.webp',
      language: 'English',
    },
    {
      locale: 'th',
      flag: 'src/assets/flags/th.webp',
      language: 'Thai',
    },
    {
      locale: 'ru',
      flag: 'src/assets/flags/ru.webp',
      language: 'Russian',
    },
    {
      locale: 'de',
      flag: 'src/assets/flags/de.webp',
      language: 'German',
    },
    {
      locale: 'es',
      flag: 'src/assets/flags/es.webp',
      language: 'Spanish',
    },
    {
      locale: 'uk',
      flag: 'src/assets/flags/ua.webp',
      language: 'Ukrainian',
    },
  ];

  const changeLanguage = (newLocale) => {
    goodsStore.updateGoods(newLocale);
    app.setLocale(newLocale);
    router.push('catalog');
    console.log('changeLanguage', newLocale);
  }

</script>

<template>
  <q-page class="column justify-center items-center relative bg-secondary window-height">
    <Logo class="logo_row logo" classes="q-mr-md">
      <LogoSvgWhite />
    </Logo>
    <div class="column bg-primary container">
      <language v-for="lang in languages"
        :key="lang.locale"
        :src="lang.flag"
        :alt="lang.language"
        :language="lang.language"
        @click="changeLanguage(lang.locale)"
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
