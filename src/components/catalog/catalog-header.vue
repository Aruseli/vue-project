<script setup>
  import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import BinIconNew from '../buttons/bin-icon-new.vue';
import LogoSimple from '../logo/logo-simple.vue';
import LogoSvgGradient from '../logo/logo-svg-gradient.vue';


  const cart = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  const openDrawer = () => {
    app.openDrawerCart(true);
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
        <LogoSvgGradient :height="100" />
      </LogoSimple>

      <div>
        <q-btn unelevated round class="relative-position" @click="openDrawer">
          <BinIconNew>
            <path v-show="cart.totalQuantity > 0" d="M23.2899 99.4944C49.461 103 73.5796 103 97.2395 99.4944C102.698 74.689 108.441 46.9768 108.441 46.9768C105.441 53.2274 94.0429 62.2554 64.2143 50.7154C34.3857 39.1754 19.7312 46.7492 14.5884 53C14.5884 53 19.6068 79.6892 23.2899 99.4944Z" fill="#0eb60b" fill-rule="nonzero" opacity="1" stroke="none" vectornator:layerName="path"/>
          </BinIconNew>
          <div v-if="cart.totalQuantity > 0" class="badge_style bg-positive flex items-center justify-center">
            <div class="text-h5 text-white">{{ cart.totalQuantity }}</div>
          </div>
          <!-- <q-badge
            align="bottom"
            rounded
            :label="cart.totalQuantity" class="absolute-bottom-left" color="positive"
          /> -->
        </q-btn>
      </div>
    </q-toolbar>

    <div class="relative-position" v-if="!app.kioskState.settings?.alt_ui">
      <q-tabs
        v-model="app.tab"
        dense
        narrow-indicator
        no-caps
        outside-arrows
        align="left"
      >
        <q-tab v-for="goodCategory in goodsStore.goods" :name="goodCategory.id" :label="goodCategory.title" content-class="category_tab_label_style" />
      </q-tabs>
    </div>
  </q-header>
</template>

<style scoped>
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
/* .q-tabs__content > * {
  background-color: var(--q-primary);
  border-radius: 4rem;
  padding: 0.3rem 3rem;
  color: white;
} */
</style>
