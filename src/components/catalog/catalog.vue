<script setup>
  import { onMounted, ref } from 'vue';
  import ProductCard from './product-card.vue';
  import { useAppStore } from '../../stores/app';
  import { useCartStore } from '../../stores/cart';
  import { useGoodsStore } from '../../stores/goods';
  import { useRouter } from 'vue-router';
  import { QSpinnerHourglass, useQuasar } from 'quasar';
  import { onUnmounted } from 'vue';
  import { t } from 'i18next';


  const $q = useQuasar();
  const goodsStore = useGoodsStore();
  const app = useAppStore();
  const cartStore = useCartStore();
  const router = useRouter();

  const timerRedirect = ref(null);
  const timerWarn = ref(null);

  // Функция-обработчик, которая переведет на новую страницу
  function redirect() {
    router.push('hello');
    cartStore.clearCart();
  }

const warnRedirect = () => {
  $q.notify({
    position: "center",
    color: "positive",
    classes: "full-width warning_customization",
    timeout: 4000,
    spinner: QSpinnerHourglass,
    spinnerSize: '3rem',
    // multiLine: true,
    actions: [
      {
        icon: "cancel",
        'aria-label': 'Dismiss',
        label: t("are_you_still_here"),
        color: "white",
        round: true,
      },
    ],
  });
};

  const resetTimer = () => {
    clearTimeout(timerRedirect.value);
    clearTimeout(timerWarn.value);
    timerRedirect.value = setTimeout(redirect, 37000);
    timerWarn.value = setTimeout(warnRedirect, 30000);
  }

  const boundResetTimer = resetTimer.bind(this);
  onMounted(() => {
    // Запускаем таймер
    resetTimer();

    // Обрабатываем события
    ["mousemove", "keydown", "click", "scroll"].forEach(e =>
      document.addEventListener(e, boundResetTimer)
    )
  })

  onUnmounted(() => {
    clearTimeout(timerRedirect.value);
    clearTimeout(timerWarn.value);
    ["mousemove", "keydown", "click", "scroll"].forEach(e =>
      document.removeEventListener(e, boundResetTimer)
    )
  })
</script>

<template>
  <q-tab-panels v-model="app.tab" animated swipeable class="window-height window-width">
    <q-tab-panel v-for="goodCategory in goodsStore.goods" :name="goodCategory.id">
      <div class="image_grid">
        <q-intersection
          v-for="(good, index) in goodCategory.goods"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection_card_settings"
        >
          <ProductCard :itemId="good.id" />
        </q-intersection>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss" scoped>
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));
  $calc_gap: calc(1rem + var(--coefficient_gap));

.image_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, $calc_width);
  gap: $calc_gap;
  width: 100%;
  height: auto;
  padding: 0 3.75rem;
  justify-content: center;
  margin-top: 2rem;
}
.intersection_card_settings {
  // min-height: 50rem;
  // height: 55rem;
  width: $calc_width;
}
</style>
