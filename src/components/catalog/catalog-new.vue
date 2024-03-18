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

  const scrollToCategory = (id) => {
    event.preventDefault();
    const element = document.getElementById(id);
    selectedIndex.value = id;
      goodsStore.goods.forEach((goodCategory, index) => {
        goodCategory.isActive = index === id;
      });
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const timerRedirect = ref(null);
  const timerWarn = ref(null);
  const countdown = ref(0);
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
    clearTimeout(animation.value);
    clearTimeout(timerWarn.value); // Очистка таймера при закрытии окна
  }

  const enter = () => {
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

  const warnRedirect = () => {
    dialogState.value = true;
    clearTimeout(timerWarn.value);
    clearTimeout(timerRedirect.value);
    countdown.value = 7
    let intervalId = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      }
      if (dialogState.value == false) {
        clearInterval(intervalId);
      }
      if (countdown.value === 0) {
        clearInterval(intervalId);
        clearTimeout(timerRedirect.value);
        clearTimeout(timerWarn.value);
        // dialogState.value = false;
        redirect();
      }
    }, 1000);

    timerWarn.value = setTimeout(() => {
      clearInterval(intervalId);
    }, 7000);
  };

  const resetTimer = () => {
    if (dialogState.value) {
      return;
    }
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
    ["mousemove", "keydown", "click", "scroll", "touchmove", "touchstart"].forEach(e =>
      document.removeEventListener(e, boundResetTimer)
    )
  })

  const dir = app.lang_dir;

</script>

<template>
  <div class="catalog_container">
    <div class="column tabs_style">
      <ul class='tabs__header'>
        {{ selectedIndex }}
        <li v-for='(goodCategory, index) in goodsStore.goods'
          :key='goodCategory.id'
          class="text-h5"
        >
          <div @click="scrollToCategory(index)" :class='{active : index == selectedIndex}'>
            {{ goodCategory.title }}
          </div>
        </li>
      </ul>
    </div>

    <q-scroll-area class="q-px-xs-none goods_container">
      <article v-for="(goodCategory, index) in goodsStore.goods" :key="goodCategory.id" class="q-mb-md catalog" :id="index" v-intersection="observer">
        <div class="text-h4 q-mb-sm catalog_header">{{ goodCategory.title }}</div>
        <div v-if="goodCategory.goods.length == 0" class="text-body1">{{$t('category_empty')}}</div>
        <transition appear @enter="enter">
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
      <div class="text-h5 text-center">{{$t('buying_session_will_end_in')}} <span>{{ countdown }}</span>&ensp;{{ $t('minutes') }}</div>
    </RedirectDialog>
  </div>
</template>

<style lang="scss" scoped>
$calc_width_alt: calc(12rem + 3vmax);
$calc_width_alt_mobile: calc(12rem + 2vmax);

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
  height: calc(100vh - 20rem);
  border-radius: 1.5rem
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
