<script setup lang="ts">
  import Logo from '../components/logo/logo.vue';
  import Language from '../components/language.vue';
  import LogoSvg from '../components/logo/logo-svg.vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from 'src/stores/app';
  import { useGoodsStore } from 'src/stores/goods';
  import { onMounted } from 'vue';

  const app = useAppStore();
  const goodsStore = useGoodsStore();

  const router = useRouter();
  const changeLanguage = async (newLocale: string) => {
    const flag = app.kioskState.catalogLocales ? app.kioskState.catalogLocales.find(l => l.lang_code === newLocale)?.flag_src : null;
    await goodsStore.updateGoods(newLocale);
    app.setLocale(newLocale);
    router.push("catalog");
    localStorage.setItem("lang", flag || '');
    if (app.kioskState.settings?.alt_ui == "design_v3") {
      document.body.className = "v3_body_style";
    }
  }
</script>

<template>
  <q-page
    class="relative-position window-height"
    :class="[app.kioskState.settings?.alt_ui === 'design_v3' ? 'flame_hello_bg' : 'hello_bg']"
  >
    <Logo class="logo_row logo" classes="q-mr-sm" v-if="app.kioskState.settings?.alt_ui !== 'design_v3'">
      <LogoSvg fill="#FAFAFA" />
    </Logo>
    <div class="bg-grey-3 mb-60 pa-60 container_languages_firs_setting">
      <Language v-for="lang in app.kioskState.catalogLocales"
        :key="lang.lang_code"
        :src="lang.flag_src"
        :alt="lang.name"
        :language="lang.lang_code"
        @click="changeLanguage(lang.lang_code)"
        class="additional_lang_container_styles"
      />
    </div>
    <div class="text-white text-h1 text-uppercase text-weight-bold text-center title_styles mb-120 line_height_1_3">{{ $t('find_your_experience') }}</div>
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

.additional_lang_container_styles {
  flex-direction: column;
  justify-content: center;
}

.hello_bg {
  display: grid;
  grid-template-rows: 1fr max-content;
  align-items: center;
  justify-content: center;
  background-image: url('/start.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.flame_hello_bg {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/grey-flame.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.title_styles {
  align-content: flex-end;
  width: 60vw;
  height: 100%;
}

</style>
