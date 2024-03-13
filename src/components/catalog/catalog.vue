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
  const countdown = ref(0);
  const dialogState = ref(false);
  const animation = ref(null);

  // Функция-обработчик, которая переведет на новую страницу
  // const redirect = () => {
  //   router.push('hello');
  //   cartStore.clearCart();
  // }

  function closeDialog() {
    dialogState.value = false;
    // clearTimeout(timerRedirect.value);
    // clearTimeout(animation.value);
    // clearTimeout(timerWarn.value); // Очистка таймера при закрытии окна
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

  // const notifyDelay = app.kioskState.params.terminal_settings.customer_inactive_notify_duration_ms
  // const warnRedirect = () => {
  //   dialogState.value = true;
  //   clearTimeout(timerWarn.value);
  //   clearTimeout(timerRedirect.value);
  //   countdown.value = 7
  //   let intervalId = setInterval(() => {
  //     if (countdown.value > 0) {
  //       countdown.value--;
  //     }
  //     if (dialogState.value == false) {
  //       clearInterval(intervalId);
  //     }
  //     if (countdown.value === 0) {
  //       clearInterval(intervalId);
  //       clearTimeout(timerRedirect.value);
  //       clearTimeout(timerWarn.value);
  //       // dialogState.value = false;
  //       redirect();
  //     }
  //   }, 1000);

  //   timerWarn.value = setTimeout(() => {
  //     clearInterval(intervalId);
  //   }, 7000);
  // };


  // const redirectDelay = app.kioskState.params.terminal_settings.customer_inactive_after_ms;
  // const resetTimer = () => {
  //   if (dialogState.value) {
  //     return;
  //   }
  //   clearTimeout(timerRedirect.value);
  //   clearTimeout(timerWarn.value);
  //   clearTimeout(animation.value);
  //   timerRedirect.value = setTimeout(redirect, 37000);
  //   timerWarn.value = setTimeout(warnRedirect, 30000);
  //   animation.value = setTimeout(enter, 28000);
  // }

  // const boundResetTimer = resetTimer.bind(this);
  // onMounted(() => {
  //   // Запускаем таймер
  //   resetTimer();
  //   // Обрабатываем события
  //   ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
  //     document.addEventListener(e, boundResetTimer)
  //   )
  // })

  // onUnmounted(() => {
  //   clearTimeout(timerRedirect.value);
  //   clearTimeout(timerWarn.value);
  //   ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
  //     document.removeEventListener(e, boundResetTimer)
  //   )
  // })

</script>

<template>
  <q-scroll-area v-if="app.altUI" class="q-pa-md goods_container">
    <div v-for="goodCategory in goodsStore.goods" :key="goodCategory.id">
      <div class="text-h3">{{ goodCategory.title }}</div>
      <transition appear @enter="enter">
        <div class="image_grid">
          <ProductCard :itemId="good.id" v-for="(good, index) in goodCategory.goods" :key="index" />
        </div>
      </transition>
    </div>
  </q-scroll-area>
  <q-tab-panels v-model="app.tab" animated swipeable class="window-height window-width" v-if="!app.altUI">
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
  >
    <div class="text-h5">{{$t('buying_session_will_end_in')}} <span>{{ countdown }}</span>&ensp;{{ $t('minutes') }}</div>
  </RedirectDialog>
</template>

<style lang="scss" scoped>
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));
  $calc_gap: calc(1rem + var(--coefficient_gap));

  .goods_container {
    width: calc(75vw - 6rem);
  }
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
