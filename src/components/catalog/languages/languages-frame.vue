<script setup lang="ts">
import BubbleArrow from './bubble-arrow.vue';
import LanguageNew from './language-new.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from "../../../stores/app";
import { useGoodsStore } from '../../../stores/goods';


const app = useAppStore();
const goodsStore = useGoodsStore();

const router = useRouter();
const changeLanguage = async (newLocale: string) => {
  await goodsStore.updateGoods(newLocale);
  app.setLocale(newLocale);
  app.openLangDialog(false);
  router.push("catalog");
};

</script>

<template>
  <BubbleArrow class="bubble" />
  <div class="languages_container">
    <div class="q-px-xs-none full-height scrollable_container full-width">
      <LanguageNew
        v-for="lang in app.kioskState.catalogLocales"
        :key="lang.lang_code"
        :src="lang.flag_src"
        :alt="lang.name"
        :language="lang.lang_code"
        @click="changeLanguage(lang.lang_code)"
      />
    </div>
  </div>
</template>

<style>
.bubble {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -3.7em;
}
.languages_container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.scrollable_container {
  overflow: scroll;
  scrollbar-width: none;
}
.scrollable_container > *:not(:last-child) {
  margin-bottom: 4em;
}
</style>
