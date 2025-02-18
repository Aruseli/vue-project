<script setup>
  import gsap from 'gsap';
import { useQuasar } from 'quasar';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import RedirectDialog from '../dialog/redirect-dialog.vue';
import ProductCard from './product-card.vue';
import RectangularButton from '../buttons/rectangular-button.vue';

  const $q = useQuasar();
  const goodsStore = useGoodsStore();
  const app = useAppStore();
  const cartStore = useCartStore();
  const router = useRouter();

  const enterCardShake = () => {
    gsap.to('.card_setting', {
      duration: 0.5,
      // delay: 28,
      scale: 1.02,
      boxShadow: "0 -12px 20px 2px rgba(35, 65, 65, 1), 0 12px 20px 2px rgba(35, 65, 65, 1)",
      ease: "none",
      stagger: {
        repeat: 1,
        yoyo: true,
        each: 0.25,
      }
    })
  }

  const redirectAt = ref(0);
  const countdown = ref(0);
  const lastAnimationStartedAt = ref(0);
  const dialogState = ref(false);

  // Функция-обработчик, которая переведет на новую страницу
  const redirect = () => {
    app.drawerCartState = false;
    router.push('hello');
    cartStore.clearCart();
    redirectAt.value = 0;
  }

  const tick = () => {
    if (Date.now() - redirectAt.value > 60*1000) {
      redirectAt.value = Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000;
    }

    const timeBeforeRedirect = redirectAt.value - Date.now();
    if (timeBeforeRedirect < 0) {
      // redirect phase
      redirect();
      return;
    }

    if (timeBeforeRedirect < app.kioskState.settings?.customer_inactivity_countdown_duration ?? 7000) {
      // countdown phase
      countdown.value = Math.floor(timeBeforeRedirect / 1000);
      app.openLangDialog(false)
      dialogState.value = true;
      return;
    }
    dialogState.value = false;

    const animationStartBeforeRedirect = app.kioskState.settings?.customer_inactivity_animation_start_before_redirect;
    if (timeBeforeRedirect < animationStartBeforeRedirect) {
      // animation phase
      const timeSinceLastAnimationStart = Date.now() - lastAnimationStartedAt.value;
      if (timeSinceLastAnimationStart < animationStartBeforeRedirect) {
        return;
      }
      console.log("Entering animation", timeBeforeRedirect);
      lastAnimationStartedAt.value = Date.now();
      enterCardShake();
      return;
    }
    // boring phase
    return;
  }

  function closeDialog() {
    redirectAt.value = Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000;
  }

  function resetRedirectTimer() {
    if (dialogState.value) {
      return;
    }
    redirectAt.value = Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000;
  }

  const redirectTimer = ref(null);
  const boundResetTimer = resetRedirectTimer.bind(this);
  onMounted(() => {
    // Запускаем таймер
    redirectAt.value = Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000;
    redirectTimer.value = setInterval(() => tick(), 100);
    // Обрабатываем события
    ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
      document.addEventListener(e, boundResetTimer)
    )
  })

  onUnmounted(() => {
    clearTimeout(redirectTimer.value);
    ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
      document.removeEventListener(e, boundResetTimer)
    )
  })

</script>

<template>
  <q-tab-panels v-model="app.tab" animated swipeable class="full-height window-width">
    <q-tab-panel v-for="goodCategory in goodsStore.goods" :name="goodCategory.id" :key="goodCategory.id">
      <transition appear @enter="enterCardShake">
        <div class="image_grid">
          <ProductCard v-for="(good, index) in goodCategory.goods"
            :good="good"
            :key="index"
            class="card_setting"
          />
        </div>
      </transition>
    </q-tab-panel>
  </q-tab-panels>
  <RedirectDialog :modelValue="dialogState">
    <template #content>
      <div class="text-h3 text-center">{{$t('buying_session_will_end_in')}} <span>{{ countdown }}</span>&ensp;{{ $t('seconds', {count: countdown}) }}</div>
    </template>
    <template #actions>
      <RectangularButton :name="$t('complete')" color="transparent" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="redirect" textColor="primary" />
      <RectangularButton :name="$t('continue')" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="closeDialog" />
    </template>
  </RedirectDialog>
</template>

<style lang="scss" scoped>

.image_grid {
  display: grid;
  grid-template-columns: repeat(4,  1fr);
  gap: 2rem;
  width: 100%;
  height: auto;
  padding: 0 4rem;
  margin-top: 25rem;

  @media(max-width: 1300px) {
    padding: 0 2rem;
    grid-template-columns: repeat(3,  1fr);
  }
  @media(max-width: 900px) {
    grid-template-columns: repeat(2,  1fr);
  }
  @media(max-width: 500px) {
    grid-template-columns: 1fr;
  }
}
</style>
