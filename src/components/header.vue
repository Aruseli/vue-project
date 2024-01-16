<script setup>
  import BinIcon from './buttons/bin-icon.vue';
  import Switcher from './switcher.vue';
  import { ref, computed, onMounted } from 'vue';
  import { useAppStore } from 'src/stores/app';
  import { useCartStore } from '../stores/cart';
  import { useGoodsStore } from '../stores/goods';
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n({ useScope: 'global' });
  const { t } = useI18n();

  const cartStore = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  // Инициализируем реактивные переменные для хранения общего количества и общей стоимости
  const totalCount = ref(0);

  // Функция для подсчета общего количества и общей стоимости
  const calculateTotal = () => {
    totalCount.value = cartStore.cart.reduce((acc, item) => acc + item.count, 0);
  };

  // Вычисляемые свойства для общего количества и общей стоимости
  const totalQuantity = computed(() => {
    return cartStore.cart.reduce((acc, item) => acc + item.count, 0);
  });

  // Фнукция для переключения языка
  const switchLanguage = (newLocale) => {
    locale.value = newLocale
  }

  const openDrawer = () => {
    app.openDrawerCart(true);
  }

   // Вызываем функцию при монтировании компонента
   onMounted(() => {
    calculateTotal();
  });

</script>


<template>
  <q-header
    reveal
    :reveal-offset="100"
    class="header"
  >
    <q-toolbar class="justify-end q-mb-lg">
      <!-- <div>
        <Switcher />
        <q-btn
          label="En"
          @click="switchLanguage('en-US')"
        />
        <q-btn
          label="Gr"
          @click="switchLanguage('de-DE')"
        />
      </div> -->
      <div class="">
        <q-btn unelevated round class="relative-position" @click="openDrawer">
          <BinIcon />
          <div v-if="totalQuantity > 0" class="badge_style bg-positive">
            <div class="text-h4 text-white q-px-sm">{{ totalQuantity }}</div>
          </div>
          <!-- <q-badge
            align="bottom"
            rounded
            :label="totalQuantity" class="absolute-bottom-left" color="positive"
          /> -->
        </q-btn>
      </div>
    </q-toolbar>

    <div class="relative-position">
      <q-tabs
        v-model="app.tab"
        inline-label
        no-caps
        indicator-color="transparent"
        active-color="white"
        align="justify"
      >
        <q-tab v-for="goodCategory in goodsStore.goods" :name="goodCategory.id" :label="goodCategory.title" />
      </q-tabs>
    </div>
  </q-header>
</template>

<style scoped>
.header {
  color: var(--q-text);
  background-color: transparent;
  padding: 1.5rem 4.8rem 1.5rem 4.8rem;
}

.badge_style {
  position: absolute;
  bottom: -1rem;
  left: -1rem;
  border-radius: 2rem;
  min-width: 3rem;
  width: max-content;
  height: 3rem;
}

.q-tabs__content > *:not(:last-of-type) {
  margin-right: 1.5rem;
}

.q-tab {
  border-radius: 2rem;
  background: var(--q-accent);
  color: #FBFBFF;
}

.q-tab-panels {
  background-color: transparent;
}

.q-tab__label {
  font-size: calc(1.2rem + 0.5vmax);
}
</style>
