<script setup>
  import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import BinIconNew from '../buttons/bin-icon-new.vue';
import LogoSimple from '../logo/logo-simple.vue';
import LogoSvgGradient from '../logo/logo-svg-gradient.vue';
import IconButton from '../buttons/icon-button.vue';
import Language from '../language.vue';
import Modal from '../overlay/modal.vue';
import LanguagesFrame from './languages/languages-frame.vue';
import LangDrawer from '../overlay/lang-drawer.vue';
import { onUpdated } from 'vue';
import { onMounted, watch, computed } from 'vue';

  const cart = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  const openDrawer = () => {
    app.openDrawerCart(true);
  }
  const changeLanguage = async (newLocale) => {
    await app.setLocale(newLocale);
    await goodsStore.updateGoods(newLocale);
  }
</script>


<template>
  <q-header
    :reveal="!app.kioskState.settings?.alt_ui"
    :reveal-offset="100"
    :class="[!app.kioskState.settings?.alt_ui ? 'header' : 'header_alt']"
  >
    <q-toolbar
      class="justify-between q-py-lg-xs"
      :class="[app.lang_dir == 'rtl' ? 'row-reverse' : 'row', !app.kioskState.settings?.alt_ui ? 'q-mb-lg-lg q-mb-xs-xs' : 'q-mb-none']"
    >

      <LogoSimple>
        <LogoSvgGradient class="logo_style" />
      </LogoSimple>

      <div class="row items-center">
        <div class="relative-position full-height">
          <IconButton
            icon="translate"
            @click="app.openLangDialog(true)"
            color='transparent'
            textColor="black"
            class="q-mr-xl-xl q-mr-xs-xs"
          />
          <LangDrawer @click="app.openLangDialog(false)" :isOpen="app.langDialog" v-if="app.kioskState.settings?.alt_ui">
            <LanguagesFrame />
          </LangDrawer>
        </div>
        <q-btn unelevated round class="relative-position" @click="openDrawer">
          <BinIconNew>
            <path v-show="cart.totalQuantity > 0" d="M23.2899 99.4944C49.461 103 73.5796 103 97.2395 99.4944C102.698 74.689 108.441 46.9768 108.441 46.9768C105.441 53.2274 94.0429 62.2554 64.2143 50.7154C34.3857 39.1754 19.7312 46.7492 14.5884 53C14.5884 53 19.6068 79.6892 23.2899 99.4944Z" fill="#0eb60b" fill-rule="nonzero" opacity="1" stroke="none"/>
          </BinIconNew>
          <div v-if="cart.totalQuantity > 0" class="badge_style bg-positive flex items-center justify-center">
            <div class="text-h5 text-white">{{ cart.totalQuantity }}</div>
          </div>
        </q-btn>
      </div>
    </q-toolbar>

    <div class="relative-position" v-if="!app.kioskState.settings?.alt_ui">
      <q-tabs

        v-model="app.tab"
        dense
        no-caps
        active-color="black"
        indicator-color="transparent"
        align="left"
      >
        <q-tab v-for="goodCategory in goodsStore.goods" :name="goodCategory.id" :label="goodCategory.title" :key="goodCategory.id" content-class="category_tab_label_style" />
      </q-tabs>
    </div>
  </q-header>

  <template>
    <Modal :isOpen="app.langDialog" @click="app.openLangDialog(false)" v-if="!app.kioskState.settings?.alt_ui">
      <div class="bg-primary container_languages" >
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

<style scoped lang="scss">
$width: calc(6.5em + 1.7262vmin);
$height: calc(8em + 1.7262vmin);
.header {
  color: var(--q-text);
  background-color: transparent;
  padding: var(--px90) 4.8rem 1.5rem 4.8rem;
  @media (max-width: 1300px) {
    padding: 1.5rem;
  }
}

.header_alt {
  color: var(--q-text);
  background-color: white;
  padding: 0 1rem;
  border-radius: 1.5rem;
  margin: 2rem;
  box-shadow: var(--border-shadow);
  @media (max-width: 1300px) {
    margin: 1rem;
    padding: 0;
  }
}

.badge_style {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  border-radius: 2.5rem;
  min-width: 4.5rem;
  width: max-content;
  height: 4.5rem;
  @media (max-width: 1300px) {
    min-width: 2.5rem;
    height: 2.5rem;
    bottom: 1rem;
    left: 1rem;
  }
}
.q-tabs__content > *:not(:last-of-type) {
  margin-right: 1.5rem;
}

.logo_style {
  width: 7em;
  @media (max-width: 1500px) {
    width: 5rem !important;
  }
  @media (max-width: 700px) {
    width: 2.5rem !important;
  }
}

</style>
