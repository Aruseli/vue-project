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
  const selectedIndex = ref(0);

  const observer = {
    handler (entry) {
      if (entry.isIntersecting === true) {
        console.log(entry.target.id);
        selectedIndex.value = entry.target.id
      }
    },
    cfg: {
      root: document.querySelector(".goods_container"),
      threshold: 0.5,
      rootMargin: '0% 0% -70% 0%'
    }
  }

  const selectCategory = (id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    selectedIndex.value = id;
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const enterCardShake = () => {
    gsap.to('.card_setting_alt', {
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
  <div class="catalog_container">
    <div class="column tabs_style">
      <ul class='tabs__header'>
        <li v-for='(goodCategory, index) in goodsStore.goods'
          :key='goodCategory.id'
          class="text-h5"
        >
          <div @click="selectCategory(index)" :class='{active : index == selectedIndex}'>
            {{ goodCategory.title }}
          </div>
        </li>
      </ul>
    </div>

    <q-scroll-area class="q-px-xs-none goods_container">
      <article v-for="(goodCategory, index) in goodsStore.goods" :key="goodCategory.id" class="q-mb-md catalog" :id="index" v-intersection="observer">
        <div class="text-h4 q-mb-sm catalog_header">{{ goodCategory.title }}</div>
        <div v-if="goodCategory.goods.length == 0" class="text-body1">{{$t('category_empty')}}</div>
        <transition appear @enter="enterCardShake">
          <div class="row image_grid_alt">
            <ProductCard :itemId="good.id" v-for="(good, index) in goodCategory.goods" :key="index" />
          </div>
        </transition>
      </article>
    </q-scroll-area>
    <RedirectDialog
      @complete="redirect"
      @continue="closeDialog"
      :modelValue="dialogState"
      :timer="countdown"
    >
    <div class="text-h5 text-center">{{$t('buying_session_will_end_in')}} <span>{{ countdown }}</span>&ensp;{{ $t('seconds', {count: countdown}) }}</div>
    </RedirectDialog>
  </div>
</template>

<style lang="scss" scoped>
.catalog_container {
  display: grid;
  grid-template-columns: 0.3fr 1fr;
  width: 100%;
  padding: 0 2rem;
  column-gap: 2rem;
  margin-top: 4rem;
  @media (max-width: 1300px) {
    margin-top: 2.125rem;
    padding: 0 1rem;
    column-gap: 1rem;
  }
}

.goods_container {
  width: 100%;
}
.image_grid_alt {
  display: grid;
  grid-template-columns: repeat(4,  1fr);
  gap: 2em;
  width: 100%;
  height: auto;
  padding: 0 0.2em;
  @media(max-width: 1300px) {
    grid-template-columns: repeat(3,  1fr);
  }
  @media(max-width: 900px) {
    grid-template-columns: repeat(2,  1fr);
  }
  @media(max-width: 500px) {
    grid-template-columns: 1fr;
  }
}

.goods_container > div > div > *:nth-last-child(-n + 1) {
  height: 100vh;
}

.tabs_style {
  box-shadow: var(--border-shadow);
  background-color: white;
  // width: 20vw;
  width: min-content !important;
  min-width: 20vw;
  height: calc(100% - 2rem);
  border-radius: 1.5rem;
}

ul.tabs__header {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.tabs__header > li {
  padding: 1.5rem;
  cursor: pointer;
  @media (max-width: 1300px) {
    padding: 1rem;
  }
}

.tab {
  color: black;
  padding: 20px;
}
li > div.active {
  font-weight: bold;
  color: var(--q-primary);
  text-transform: uppercase;
  scale: 1.05;
  border-radius: 0.3rem;
}
</style>
