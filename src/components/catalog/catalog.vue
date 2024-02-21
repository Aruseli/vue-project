<script setup>
  import gsap from 'gsap';
import { useQuasar } from 'quasar';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import RedirectDialog from '../dialog/redirect-dialog.vue';
import ProductCard from './product-card.vue';

  const $q = useQuasar();
  const goodsStore = useGoodsStore();
  const app = useAppStore();
  const cartStore = useCartStore();
  const router = useRouter();

  const timerRedirect = ref(null);
  const timerWarn = ref(null);
  const countdown = ref(null);
  const dialogState = ref(false);
  const animation = ref(null);

  // Функция-обработчик, которая переведет на новую страницу
  const redirect = () => {
    router.push('hello');
    cartStore.clearCart();
  }

  function closeDialog() {
    dialogState.value = false;
    clearTimeout(timerRedirect.value);
    clearInterval(timerWarn.value); // Очистка таймера при закрытии окна
  }

  const enter = () => {
    gsap.to('.card_setting', {
      duration: 0.5,
      // delay: 28,
      scale: 1.02,
      boxShadow: "0 -12px 20px -12px rgba(35, 65, 65, 1), 0 12px 20px -12px rgba(35, 65, 65, 1)",
      ease: "none",
      stagger: {
        repeat: 1,
        yoyo: true,
        each: 0.25,
      }
    })
  }

  const warnRedirect = () => {
    dialogState.value = true;
    countdown.value = 7; // Например, 5 секунд для обратного отсчета
    // Очистка предыдущего таймера, если он есть
    clearTimeout(timerWarn.value);
    // Новый интервал
    timerWarn.value = setTimeout(() => {
      countdown.value--;

      if (countdown.value === 0) {
        clearInterval(timerWarn.value);
        dialogState.value = false;
        timerWarn.value = null;
        redirect();
      }
    }, 1000);
  };


  const resetTimer = () => {
    clearTimeout(timerRedirect.value);
    clearTimeout(timerWarn.value);
    clearTimeout(animation.value);
    timerRedirect.value = setTimeout(redirect, 37000);
    timerWarn.value = setTimeout(warnRedirect, 30000);
    animation.value = setTimeout(enter, 28000);
  }

  const boundResetTimer = resetTimer.bind(this);
  onMounted(() => {
    // Запускаем таймер
    resetTimer();
    // Обрабатываем события
    ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
      document.addEventListener(e, boundResetTimer)
    )
  })

  onUnmounted(() => {
    clearTimeout(timerRedirect.value);
    clearTimeout(timerWarn.value);
    clearInterval(timerWarn.value);
    ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
      document.removeEventListener(e, boundResetTimer)
    )
  })

</script>

<template>
  <q-tab-panels v-model="app.tab" animated swipeable class="window-height window-width">
    <q-tab-panel v-for="goodCategory in goodsStore.goods" :name="goodCategory.id">
      <transition appear @enter="enter">
        <div class="image_grid">
          <ProductCard :itemId="good.id" v-for="(good, index) in goodCategory.goods" :key="index" />
        </div>
      </transition>
    </q-tab-panel>
  </q-tab-panels>
  <RedirectDialog
    @complete="redirect"
    @continue="closeDialog"
    :modelValue="dialogState"
    :timer="countdown"
  />
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
</style>
