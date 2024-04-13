<script setup lang="ts">
  import gsap from 'gsap';
import { useQuasar, IntersectionValue } from 'quasar';
import { onMounted, onUnmounted, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../stores/app';
import { useCartStore } from '../../stores/cart';
import { useGoodsStore } from '../../stores/goods';
import RedirectDialog from '../dialog/redirect-dialog.vue';
import ProductCardV3 from './product-card-v3.vue';
import ProductCard from '../catalog/product-card.vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import LogoSimple from '../logo/logo-simple.vue';
import LogoSvg from '../logo/logo-svg.vue';
import BinButton from './buttons/bin-button.vue';
import BinIcon from '../icons/bin-icon.vue';
import BinIconV3 from '../icons/bin-icon-v3.vue';
import Modal from '../overlay/modal.vue';
import LanguageNew from '../catalog/languages/language-new.vue';
import { useIntersectionObserver } from '@vueuse/core'

  const target = ref(null);
  const $q = useQuasar();
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

  const observer = useIntersectionObserver(
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
    console.log("selectedLang.value", selectedLang.value);
  };

  const selectCategory = (id: string, event: Event) => {
    event.preventDefault();
    const element = document.getElementById(id);
    selectedIndex.value = id;
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };

    const enterCardShakeAlt = () => {
      gsap.to('.card_setting_v2', {
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

    const enterCardShake = () => {
      gsap.to('.card_setting_v3', {
        duration: 0.5,
        // delay: 28,
        scale: 1.02,
        boxShadow: "0 -12px 20px 2px rgba(136, 216, 99, 1), 0 12px 20px 2px rgba(136, 216, 99, 1)",
        ease: "none",
        stagger: {
          repeat: 1,
          yoyo: true,
          each: 0.25,
        }
      })
    }

  const animation = (ui: string) => {
    if (ui === "design_v2") {
      return enterCardShake();
    } else {
      return enterCardShakeAlt();
    }
  };

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
    if (Date.now() - redirectAt.value > 60 * 1000) {
      redirectAt.value =
        Date.now() +
        (app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000);
    }

    const timeBeforeRedirect = redirectAt.value - Date.now();
    if (timeBeforeRedirect < 0) {
      // redirect phase
      redirect();
      return;
    }

    if (
      timeBeforeRedirect <
      (app.kioskState.settings?.customer_inactivity_countdown_duration ?? 7000)
    ) {
      // countdown phase
      countdown.value = Math.floor(timeBeforeRedirect / 1000);
      app.openLangDialog(false);
      dialogState.value = true;
      return;
    }
    dialogState.value = false;

    const animationStartBeforeRedirect =
      app.kioskState.settings
        ?.customer_inactivity_animation_start_before_redirect ?? 0;
    if (timeBeforeRedirect < animationStartBeforeRedirect) {
      // animation phase
      const timeSinceLastAnimationStart =
        Date.now() - lastAnimationStartedAt.value;
      if (timeSinceLastAnimationStart < animationStartBeforeRedirect) {
        return;
      }
      console.log("Entering animation", timeBeforeRedirect);
      lastAnimationStartedAt.value = Date.now();
      animation("design_v2"); // Pass a string argument to the animation function
      return;
    }
    // boring phase
    return;
  };

  function closeDialog() {
    redirectAt.value =
      Date.now() +
      (app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000);
  }

  function resetRedirectTimer() {
    if (dialogState.value) {
      return;
    }
    redirectAt.value =
      Date.now() +
      (app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000);
  }

  const redirectTimer = ref(null);
  const boundResetTimer = resetRedirectTimer.bind(this);
  onMounted(() => {
    // Запускаем таймер
    redirectAt.value =
      Date.now() +
      (app.kioskState.settings?.customer_inactivity_before_redirect ?? 37000);
    redirectTimer.value = setInterval(() => tick(), 100) as unknown as null;
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
  });

</script>

<template>
    <div
    class="catalog_container"
    :class="[app.kioskState.settings?.alt_ui == 'design_v2' ? 'catalog_container_v2 q-pa-md' : '']"
  >
    <header
      class="row justify-between q-pa-xl header_style bg-grey-2"
      :class="[app.kioskState.settings?.alt_ui == 'design_v2' ? 'header_style_v2' : '']"
    >
      <LogoSimple
        :text_style="app.kioskState.settings?.alt_ui == 'design_v3' ? 'text-green' : 'text-primary'"
      >
        <LogoSvg
          :fill="app.kioskState.settings?.alt_ui == 'design_v3' ? '#88D863' : '#1f1f1f'"
          width="6em"
          height="6em"
        />
      </LogoSimple>
      <BinButton
        @click="openDrawer"
        :quantity="cartStore.totalQuantity"
        :badgeStyleAlt="app.kioskState.settings?.alt_ui == 'design_v3' ? 'bg-red' : ''"
      >
        <component :quantity="cartStore.totalQuantity" :is="app.kioskState.settings?.alt_ui == 'design_v3' ? BinIconV3 : BinIcon">
        </component>
      </BinButton>
    </header>
    <aside
      class="q-py-xl q-px-lg category_container bg-grey-2"
      :class="[app.kioskState.settings?.alt_ui == 'design_v2' ? 'category_container_v2' : '']"
    >
      <div class="scrollable_container column justify-between full-height">
        <section class="column">
          <div class="categories_style mb-60">
            <div class="text-h3 text-uppercase text-white mb-20">
              {{ $t('categories') }}
            </div>
            <div class="bg-white categories_line" />
          </div>
          <ul class='tabs__header'>
            <li v-for='(goodCategory, index) in goodsStore.goods'
              :key='goodCategory.id'
              class="text-h5 text-weight-bold"
            >
              <div @click="selectCategory(goodCategory.id, $event)" :class='{active : goodCategory.id == selectedIndex}'>
                {{ goodCategory.title }}
              </div>
            </li>
          </ul>
        </section>
        <div class="column" v-if="app.kioskState.settings?.alt_ui == 'design_v3'">
          <div class="row">
            <LanguageNew
              :language="selectedLang"
              :src="`/flags/${selectedLang}.webp`"
              @click="app.openLangDialog(true)"
            />
          </div>
          <q-btn
            flat
            color="grey"
            class="text-body1 text-center help_button"
            :label="$t('do_you_need_some_help')"
          />
        </div>
      </div>
    </aside>

    <q-scroll-area class="q-px-xs-none goods_container q-mt-lg">
      <article
        v-for="goodCategory in goodsStore.goods"
        :key="goodCategory.id"
        :id="goodCategory.id"
        ref="target"
        class="mb-90"
      >
        <div
          class="text-h4 q-mb-lg text-uppercase"
          :class="[app.kioskState.settings?.alt_ui == 'design_v3' ? 'text-white' : 'text-black']"
        >
          {{ goodCategory.title }}
        </div>
        <div
          v-if="goodCategory.goods.length == 0"
          class="text-body1"
          :class="[app.kioskState.settings?.alt_ui == 'design_v3' ? 'text-white' : 'text-black']"
        >{{$t('category_empty')}}</div>
        <transition appear @enter="animation(app.kioskState.settings?.alt_ui ?? '')">
          <div class="row image_grid">
            <component
              :good="good"
              v-for="(good, index) in goodCategory.goods"
              :key="index"
              :class="[app.kioskState.settings?.alt_ui == 'design_v3' ? 'card_setting' : 'card_setting_v2']"
              :is="app.kioskState.settings?.alt_ui == 'design_v3' ? ProductCardV3 : ProductCard"
            ></component>
          </div>
        </transition>
      </article>
    </q-scroll-area>
    <RedirectDialog :modelValue="dialogState">
      <template #content>
        <div class="text-h5 text-center">{{$t('buying_session_will_end_in')}} <span>{{ countdown }}</span>&ensp;{{ $t('seconds', {count: countdown}) }}</div>
      </template>
      <template #actions>
        <RectangularButton :name="$t('complete')" color="transparent" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="redirect" textColor="primary" />
        <RectangularButton :name="$t('continue')" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="closeDialog" />
      </template>
    </RedirectDialog>
  </div>
  <template>
    <Modal :isOpen="app.langDialog" @click="app.openLangDialog(false)">
      <div class="bg-grey-3 container_languages_v3" >
        <LanguageNew v-for="lang in app.kioskState.catalogLocales"
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

<style lang="scss" scoped>
.catalog_container {
  background-color: #181818;
  display: grid;
  grid-template-areas:
                      "header header"
                      "category catalog"
                      "category catalog";
  grid-template-rows: max-content 1fr;
  grid-template-columns: max-content 1fr;
  column-gap: var(--px30);
  width: 100%;
  height: 100vh;
}

.catalog_container_v2 {
  background-image: url(/bg.svg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  row-gap: 2rem;
}

.header_style {
  grid-area: header;
  border: var(--border);
  height: max-content;
}

.header_style_v2 {
  color: var(--q-text);
  background-color: white;
  border-radius: 1rem;
  box-shadow: var(--border-shadow);
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
.category_container_v2 {
  box-shadow: var(--border-shadow);
  background-color: white;
  border-radius: 1rem;
}
.categories_style {
  width: max-content;
}
.categories_line {
  width: 100%;
  height: 0.3em;
}

.help_button {
  text-transform: none;
}

.goods_container {
  width: 100%;
  padding-right: var(--px30);
}

.image_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--px20);
  width: 100%;
  height: auto;
  padding: 0 0.2em;
  @media(max-width: 900px) {
    grid-template-columns: repeat(2,  1fr);
  }
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
  color: var(--body-text);
}
</style>
