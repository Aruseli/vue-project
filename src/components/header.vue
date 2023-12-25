<script setup>
  import BinIcon from './buttons/bin-icon.vue';
  import Switcher from './switcher.vue';
  import { ref, computed, onMounted } from 'vue';
  import { useAppStore } from 'src/stores/app';
  import { useGoodsStore } from '../stores/products';
  import { useCartStore } from '../stores/cart';
  import { useI18n } from 'vue-i18n';
  import BinButton from './buttons/bin-button.vue';

  const { locale } = useI18n({ useScope: 'global' });
  const { t } = useI18n();

  const goodsStore = useGoodsStore();
  const cartStore = useCartStore();
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
    reveal-offset="100"
    class="header"
  >
    <q-toolbar class="justify-between">
      <div>
        <Switcher />
        <q-btn
          label="En"
          @click="switchLanguage('en-US')"
        />
        <q-btn
          label="Gr"
          @click="switchLanguage('de-DE')"
        />
      </div>
      <div class="absolute-right">
        <q-btn unelevated round class="relative-position" @click="goodsStore.openDrawerCart(true)">
          <BinIcon />
          <q-badge align="bottom" rounded :label="totalQuantity" class="absolute-bottom-left" color="positive" />
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
        <q-tab name="food" :label="t('food')" />
        <q-tab name="roll_sets" :label="t('roll_sets')" />
        <q-tab name="weight_sets" :label="t('weight_sets')" />
        <q-tab name="consumption_sets" :label="t('consumption_sets')" />
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
</style>
