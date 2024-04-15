<script setup lang="ts">
  import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import BinIcon from '../icons/bin-icon.vue';
import LogoSimple from '../logo/logo-simple.vue';
import LogoSvg from '../logo/logo-svg.vue';
import IconButton from '../buttons/icon-button.vue';
import BinButton from '../buttons/bin-button.vue';
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
const changeLanguage = async (newLocale: string) => {
  await app.setLocale(newLocale);
  await goodsStore.updateGoods(newLocale);
};
</script>


<template>
  <q-header
    reveal
    :reveal-offset="100"
    class="header"
  >
    <q-toolbar
      class="justify-between q-py-lg-xs"
      :class="[app.lang_dir == 'rtl' ? 'row-reverse' : 'row', 'q-mb-lg-lg q-mb-xs-xs']"
    >

      <LogoSimple>
        <LogoSvg
          fill="#272727"
          width="6em"
          height="6em"
        />
      </LogoSimple>

      <div class="row items-center">
        <div class="relative-position full-height">
          <IconButton
            icon="translate"
            @click="app.openLangDialog(true)"
            color='transparent'
            textColor="black"
            iconStyle="translate_style"
            class="q-mr-xl-xl q-mr-xs-xs"
          />
        </div>
        <BinButton @click="openDrawer" :quantity="cart.totalQuantity">
          <BinIcon :quantity="cart.totalQuantity > 0" />
        </BinButton>
      </div>
    </q-toolbar>

    <div class="relative-position">
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
    <Modal :isOpen="app.langDialog" @click="app.openLangDialog(false)">
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
.q-tabs__content > *:not(:last-of-type) {
  margin-right: 1.5rem;
}
.translate_style {
  font-size: 5rem !important;
}
</style>
