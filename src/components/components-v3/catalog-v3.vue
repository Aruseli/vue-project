<script setup lang="ts">
  import gsap from 'gsap';
  import { onMounted, onUnmounted, ref, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '../../stores/app';
  import { useCartStore } from '../../stores/cart';
  import { useGoodsStore } from '../../stores/goods';
  import RedirectDialog from '../dialog/redirect-dialog.vue';
  import ProductCard from './product/product-card.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import LogoSimple from '../logo/logo-simple.vue';
  import LogoSvg from '../logo/logo-svg.vue';
  import Language from './languages/language.vue';
  import BinButton from '../buttons/bin-button.vue';
  import BinIcon from './icons/bin-icon.vue';
  import Modal from '../overlay/modal.vue';
  import { useIntersectionObserver } from '@vueuse/core';
  import CartDrawer from './cart/cart-drawer.vue';
  import Cta from './cta.vue';

  const target = ref(null);
  const goodsStore = useGoodsStore();
  const app = useAppStore();
  const cartStore = useCartStore();
  const router = useRouter();
  const selectedIndex = ref('');
  const selectedLang = ref('');

  const options = {
    threshold: [0],
    rootMargin: "0% 0% -70% 0%",
  }

  const { stop } = useIntersectionObserver(
    target,
    ([ isIntersecting ], observerElement) => {
      selectedIndex.value = isIntersecting.target.id;
    }, options
  )
  const openDrawer = () => {
    app.openDrawerCart(true);
  }
  const changeLanguage = async (newLocale: string) => {
    await app.setLocale(newLocale);
    await goodsStore.updateGoods(newLocale);
    selectedLang.value = newLocale;
    localStorage.setItem("lang", newLocale);
    console.log("LNAGUAGE", newLocale)
    app.langDialog = false;
  };

  const selectCategory = (id: string, event: Event) => {
    event.preventDefault();
    const element = document.getElementById(id);
    selectedIndex.value = id;
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const animation = () => {
    gsap.to('.card_setting_v3', {
      duration: 0.5,
      // delay: 28,
      scale: 1.02,
      boxShadow: "0 0 6px 2px rgba(136, 216, 99, 1), 0 0 6px 2px rgba(136, 216, 99, 1)",
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
    dialogState.value = false;
    router.push('hello');
    cartStore.clearCart();
    redirectAt.value = 0;
  }

  const tick = () => {
    if (Date.now() - redirectAt.value > 60 * 1000) {
      redirectAt.value =
        Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect! ?? 37000;
    }

    const timeBeforeRedirect = redirectAt.value - Date.now();
    if (timeBeforeRedirect < 0) {
      // redirect phase
      redirect();
      return;
    }

    if ( timeBeforeRedirect < app.kioskState.settings?.customer_inactivity_countdown_duration! ?? 7000) {
      // countdown phase
      countdown.value = Math.floor(timeBeforeRedirect / 1000);
      app.openLangDialog(false);
      dialogState.value = true;
      return;
    }
    dialogState.value = false;

    const animationStartBeforeRedirect = app.kioskState.settings?.customer_inactivity_animation_start_before_redirect ?? 0;
    if (timeBeforeRedirect < animationStartBeforeRedirect) {
      // animation phase
      const timeSinceLastAnimationStart =
        Date.now() - lastAnimationStartedAt.value;
      if (timeSinceLastAnimationStart < animationStartBeforeRedirect) {
        return;
      }
      console.log("Entering animation", timeBeforeRedirect);
      lastAnimationStartedAt.value = Date.now();
      animation(); // Pass a string argument to the animation function
      return;
    }
    // boring phase
    return;
  };

  function closeDialog() {
    console.log('click')
    dialogState.value = false;
    redirectAt.value =
      Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect! ?? 37000;
  }

  function resetRedirectTimer() {
    if (dialogState.value) {
      return;
    }
    redirectAt.value =
      Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect! ?? 37000;
  }

  const redirectTimer = ref<NodeJS.Timeout | null>(null);
  const boundResetTimer = resetRedirectTimer.bind(this);
  onMounted(() => {
    // Запускаем таймер
    redirectAt.value = Date.now() + app.kioskState.settings?.customer_inactivity_before_redirect! ?? 37000;
    redirectTimer.value = setInterval(() => tick(), 100);
    // Обрабатываем события
    [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchmove",
      "touchstart",
    ].forEach((e) => document.addEventListener(e, boundResetTimer));
    selectedLang.value = localStorage.getItem("lang") || "";
  });

  onUnmounted(() => {
    clearInterval(redirectTimer.value as unknown as number);
    [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchmove",
      "touchstart",
    ].forEach((e) => document.removeEventListener(e, boundResetTimer));
    // stop();
  });

</script>

<template>
  <div class="catalog_container relative-position">

    <!-- header -->
    <header class="row justify-between q-pa-xl header_style_v3 bg-grey-2">
      <div class="row q-gutter-x-md">
        <LogoSimple text_style="text-green">
          <LogoSvg
            fill="#88D863"
            width="6em"
            height="6em"
          />
        </LogoSimple>
        <div class="row">
          <Language
            :src="`/flags/4x3/${selectedLang}.svg`"
            @click="app.openLangDialog(true)"
            newClass="additional_lang_style"
          />
        </div>
      </div>
      <BinButton
        @click="openDrawer"
        :quantity="cartStore.totalQuantity"
        badgeStyleAlt="bg-red"
      >
        <BinIcon :quantity="cartStore.totalQuantity" />
      </BinButton>
    </header>

    <!-- list of categories -->
    <aside class="q-py-xl q-px-lg category_container bg-grey-2">
      <div class="scrollable_container column justify-between full-height">
        <section class="column">
          <div class="categories_style mb-60">
            <div class="text-h2 text-uppercase text-white mb-20">
              {{ $t('categories') }}
            </div>
            <div class="bg-white categories_line" />
          </div>
          <ul class='tabs__header'>
            <li v-for='(goodCategory, index) in goodsStore.goods'
              :key='goodCategory.id'
              class="text-h3 text-weight-bold"
            >
              <div @click="selectCategory(goodCategory.id, $event)" :class='{active : goodCategory.id == selectedIndex}'>
                {{ goodCategory.title }}
              </div>
            </li>
          </ul>
        </section>
        <div class="column">
          <!-- <div class="row">
            <Language
              :language="selectedLang"
              :src="`/flags/4x3/${selectedLang}.svg`"
              @click="app.openLangDialog(true)"
            />
          </div> -->
          <q-btn
            flat
            color="grey"
            class="text-h4 text-center help_button"
            :label="$t('do_you_need_some_help')"
          />
        </div>
      </div>
    </aside>

    <!-- catalog -->
    <q-scroll-area class="goods_container q-px-lg q-pt-lg full-width relative-position full-height">
      <article
        v-for="goodCategory in goodsStore.goods"
        :key="goodCategory.id"
        :id="goodCategory.id"
        ref="target"
        class="mb-90"
      >
        <div class="text-h2 q-mb-lg text-uppercase text-white">
          {{ goodCategory.title }}
        </div>
        <div
          v-if="goodCategory.goods.length == 0"
          class="text-h3 text-white"
        >{{$t('category_empty')}}</div>
        <transition appear @enter="animation">
          <div class="row image_grid">
            <ProductCard
              v-for="(good, index) in goodCategory.goods"
              :good="good"
              :key="index"
              class="card_setting_v3"
            />
          </div>
        </transition>
      </article>
    </q-scroll-area>

    <!-- cart information -->
    <Cta @click="openDrawer" class="cta_style" />

    <CartDrawer :isOpen="app.drawerCartState" @click="app.openDrawerCart(false);" additionalCartClass="cart_positioning" />

    <!-- redirect dialog when user is inactive-->
    <RedirectDialog
      :modelValue="dialogState"
      additionalCartStyle="redirect_dialog_style q-py-lg"
      titleClass="text-white"
    >
      <template #content>
        <div class="text-h3 text-center text-white">{{$t('buying_session_will_end_in')}} <span>{{ countdown }}</span>&ensp;{{ $t('seconds', {count: countdown}) }}</div>
      </template>
      <template #actions>
        <RectangularButton
          :name="$t('complete')"
          color="white"
          class="q-px-md-sm q-px-xs-sm q-py-xs-xs"
          @click="redirect"
          textColor="primary"
        />
        <RectangularButton
          :name="$t('continue')"
          color="green"
          class="q-px-md-sm q-px-xs-sm q-py-xs-xs"
          @click="closeDialog"
        />
      </template>
    </RedirectDialog>
  </div>

  <!-- languages dialog -->
  <template>
    <Modal :isOpen="app.langDialog" @click="app.openLangDialog(false)">
      <div class="bg-grey-3 container_languages_v3" >
        <Language v-for="lang in app.kioskState.catalogLocales"
          :key="lang.lang_code"
          :src="lang.flag_src"
          :alt="lang.name"
          :language="lang.lang_code"
          @click="changeLanguage(lang.lang_code)"
        />
      </div>
    </Modal>
  </template>
</template>

<style lang="scss">
  $width: calc(2.5em + 1.7262vmin);
  $height: calc(1em + 1.7262vmin);
.cart_positioning {
  position: absolute;
  grid-area: catalog / catalog / cta / cta;
}
.catalog_container {
  background-color: #181818;
  display: grid;
  grid-template-areas:
                      "header header"
                      "category catalog"
                      "category catalog"
                      "category cta";
  grid-template-rows: max-content 1fr;
  grid-template-columns: max-content 1fr;
  width: 100%;
  height: 100vh;
  color: var(--body-text);
}

.header_style_v3 {
  grid-area: header;
  border: var(--border);
  height: max-content;
}

.scrollable_container {
  overflow-y: scroll;
  scrollbar-width: none;
}
.category_container {
  grid-area: category;
  border-right: var(--border);
  border-left: var(--border);
  border-bottom: var(--border);
  width: min-content !important;
  min-width: 20vw;
  height: 100%;
}
.categories_style {
  width: max-content;
}
.categories_line {
  width: 100%;
  height: 0.3em;
}
.cta_style {
  grid-area: cta;
  z-index: 2;
}

.help_button {
  text-transform: none;
}

.image_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--px20);
  width: 100%;
  height: auto;
  padding: 0 0.2em;
  @media(max-width: 80rem) {
    grid-template-columns: repeat(2,  1fr);
  }
}
.goods_container {
  grid-area: catalog;
}
.goods_container > div > div > *:nth-last-child(-n + 1) {
  height: 100vh;
}
ul.tabs__header {
  list-style: none;
  margin: 0;
  padding: 0;
}

ul.tabs__header > li {
  padding: 0rem;
  cursor: pointer;
  margin-bottom: var(--px60);
}

li > div {
  color: #5D5D5D;
}
li > div.active {
  color: white;
  transform-origin: left;
}

.redirect_dialog_style {
  background-color: grey;
  border-radius: var(--border-xxs) !important;
}

.additional_lang_style {
  width: $width !important;
  height: $height !important;
}
</style>
