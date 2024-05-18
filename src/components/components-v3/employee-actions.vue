<script setup lang="ts">
import { PropType, ref, onMounted } from 'vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import LogoSimple from '../logo/logo-simple.vue';
import LogoSvg from '../logo/logo-svg.vue';
import { useAppStore } from 'src/stores/app';
import { useGoodsStore } from 'src/stores/goods';
import Modal from '../overlay/modal.vue';
import Language from '../components-v3/languages/language.vue';

const app = useAppStore();
const goodsStore = useGoodsStore();
const selectedLang = ref('');

const changeLanguage = async (newLocale: string) => {
  await app.setLocale(newLocale);
  await goodsStore.updateGoods(newLocale);
  selectedLang.value = newLocale;
  app.openLangDialog(false);
};

export interface Button {
 name: string;
 disable: boolean;
 badge?: boolean;
 badge_text?: string;
 click: () => void;
}
const props = defineProps({
  buttons: {
    type: Array as PropType<Button[]>,
    default: []
  },
})
const emit = defineEmits(['click'])
</script>

<template>
  <div class="column justify-center items-center full-height full-width container">
    <LogoSimple text_style="text-green" class="logo_positioning">
      <LogoSvg
        fill="#88D863"
        width="6em"
        height="6em"
      />
    </LogoSimple>
    <q-btn flat round @click="app.openLangDialog(true)" class="trans_positioning">
      <q-icon name="img:/trans.svg" size="4.5rem" />
    </q-btn>
    <RectangularButton
      v-for="(button, index) in props.buttons"
      :key="index"
      :name='$t(button.name)'
      :disable='button.disable'
      class="button_style"
      :class="{ 'blocked': button.disable }"
      color="grey-3"
      @click="button.click"
    >
      <div v-if="button.badge == true" class="badge_style bg-green flex items-center justify-center">
        <div class="text-grey-3 text-h3">{{ button.badge_text }}</div>
      </div>
    </RectangularButton>

  </div>
  <template>
    <Modal :isOpen="app.langDialog" @click="app.openLangDialog(false)">
      <div class="bg-grey-3 container_languages_v3 pa-60" >
        <Language v-for="lang in app.kioskState.catalogLocales"
          :key="lang.lang_code"
          :src="lang.flag_src"
          :alt="lang.name"
          :language="lang.lang_code"
          @click="changeLanguage(lang.lang_code)"
        />
      </div>
    </Modal>
  </template>
</template>

<style scoped>
.container {
  padding: 4rem;
  @media (max-width: 899px) {
    padding: 2rem;
  }
}
.container > *:not(:last-child) {
  margin-bottom: 2rem;
}
.container > *:first-child {
  margin-bottom: 7rem;
  @media (max-width: 1300px) {
    margin-bottom: 3rem;
  }
}
.logo_positioning {
  position: absolute;
  top: var(--px40);
  left: var(--px40);
}

.trans_positioning {
  position: absolute;
  top: 3.125rem;
  right: var(--px40);
}
.button_style {
  width: 60vw;
  padding: 2.5rem;
  border-radius: var(--border-xxs);
  @media (max-width: 1300px) {
    padding: 1.5rem;

  }
  @media (max-width: 899px) {
    width: 100%;
    padding: 1rem;
  }
}
.badge_style {
  position: absolute;
  top: -1rem;
  right: -1rem;
  border-radius: 2.5rem;
  min-width: 4.5rem;
  width: max-content;
  height: 4.5rem;
  @media (min-width: 80rem) {
    min-width: 3rem;
    height: 3rem;
  }
}
.blocked {
  filter: brightness(0.3);
}
</style>
