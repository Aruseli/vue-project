<script setup>
  import BinIconNew from '../buttons/bin-icon-new.vue';
  import Switcher from '../switcher.vue';
  import { ref, computed, onMounted } from 'vue';
  import { useAppStore } from '../../stores/app';
  import { useCartStore } from '../../stores/cart';
  import { useGoodsStore } from '../../stores/goods';
  import { useI18n } from 'vue-i18n';
  import LogoSimple from '../logo/logo-simple.vue';
  import LogoSvgGradient from '../logo/logo-svg-gradient.vue';

  const { locale } = useI18n({ useScope: 'global' });
  const { t } = useI18n();

  const cart = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  const openDrawer = () => {
    app.openDrawerCart(true);
  }

</script>


<template>
  <q-header
    reveal
    :reveal-offset="100"
    class="header"
  >
    <q-toolbar class="justify-between q-mb-lg">

      <LogoSimple>
        <LogoSvgGradient :width="100" :height="100" />
      </LogoSimple>

      <div class="">
        <q-btn unelevated round class="relative-position" @click="openDrawer">
          <BinIconNew />
          <div v-if="cart.totalQuantity > 0" class="badge_style bg-positive flex items-center">
            <div class="text-h4 text-white q-px-sm">{{ cart.totalQuantity }}</div>
          </div>
          <!-- <q-badge
            align="bottom"
            rounded
            :label="cart.totalQuantity" class="absolute-bottom-left" color="positive"
          /> -->
        </q-btn>
      </div>
    </q-toolbar>

    <div class="relative-position">
      <q-tabs
        v-model="app.tab"
        dense
        narrow-indicator
        no-caps
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
}

.badge_style {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  border-radius: 2.5rem;
  min-width: 3rem;
  width: max-content;
  height: 4.5rem;
}

.q-tabs__content > *:not(:last-of-type) {
  margin-right: 1.5rem;
}
</style>
