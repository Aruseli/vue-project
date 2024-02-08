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
  const shaking = ref(false);

  // Функция-обработчик, которая переведет на новую страницу
  function redirect() {
    router.push('hello');
    cartStore.clearCart();
  }

const warnRedirect = () => {
  shaking.value = true;
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
        'aria-label': 'cancel',
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
        <ProductCard :itemId="good.id" v-for="(good, index) in goodCategory.goods"
        :key="index" class="shakingItem" />
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
  // width: $calc_width;
}

.shakingItem {

  animation: shaking_anime 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s infinite both;
}

@keyframes shaking_anime {
  0% {
    -webkit-transform: translateZ(0);
            transform: translateZ(0);
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0);
  }
  50% {
    -webkit-transform: translateZ(50px);
            transform: translateZ(50px);
    -webkit-box-shadow: 0 -12px 20px -12px rgba(0, 0, 0, 0.35), 0 12px 20px -12px rgba(0, 0, 0, 0.35);
            box-shadow: 0 -12px 20px -12px rgba(0, 0, 0, 0.35), 0 12px 20px -12px rgba(0, 0, 0, 0.35);
  }
  100% {
    -webkit-transform: translateZ(0);
            transform: translateZ(0);
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
