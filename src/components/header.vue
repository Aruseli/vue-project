<script setup>
  import BinIcon from './buttons/bin-icon.vue';
  import Switcher from './switcher.vue';
  import { ref, computed, onMounted } from 'vue';
  import { productsStore } from 'src/stores/store';
  import { useI18n } from 'vue-i18n';
  import BinButton from './buttons/bin-button.vue';

  const { locale } = useI18n({ useScope: 'global' });
  const { t } = useI18n();

  const store = productsStore();

  // Получаем массив из store
  const cart = store.cart;

  // Инициализируем реактивные переменные для хранения общего количества и общей стоимости
  const totalCount = ref(0);

  // Функция для подсчета общего количества и общей стоимости
  const calculateTotal = () => {
    totalCount.value = cart.reduce((acc, item) => acc + item.count, 0);
  };

  // Вычисляемые свойства для общего количества и общей стоимости
  const totalQuantity = computed(() => {
    return cart.reduce((acc, item) => acc + item.count, 0);
  });

  // Фнукция для переключения языка
  const switchLanguage = (newLocale) => {
    locale.value = newLocale
  }

  const openDrawer = () => {
    store.openDrawerCart(true);
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
    <q-toolbar class="justify-end">
      <Switcher />
      <div>
        <q-btn
          label="En"
          @click="switchLanguage('en-US')"
        />
        <q-btn
          label="Gr"
          @click="switchLanguage('de-DE')"
        />
      </div>
    </q-toolbar>

    <div class="relative-position">
      <q-tabs
        v-model="store.tab"
        inline-label
        no-caps
        indicator-color="transparent"
        active-color="white"
      >
        <q-tab name="food" :label="t('food')" />
        <q-tab name="roll_sets" :label="t('roll_sets')" />
        <q-tab name="weight_sets" :label="t('weight_sets')" />
        <q-tab name="consumption_sets" :label="t('consumption_sets')" />
      </q-tabs>
      <q-btn unelevated round class="absolute-right q-mr-lg" @click="openDrawer">
        <q-icon class="round-button-light_green">
          <BinIcon />
          <q-badge align="bottom" round>{{ totalQuantity }}</q-badge>
        </q-icon>
      </q-btn>
      <!-- <bin-button /> -->
    </div>
  </q-header>
</template>

<style scoped>
.header {
  color: var(--q-text);
  background-color: var(--q-header_bg);
  padding-bottom: 1rem;
}
</style>
