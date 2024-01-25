<script setup>
  import { onMounted, ref } from 'vue';
  import ProductCard from '../components/product-card.vue';
  import { useGoodsStore } from '../stores/goods';
  import { useAppStore } from 'src/stores/app';
  import { useRouter } from 'vue-router';
  import { useCartStore } from 'src/stores/cart';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const goodsStore = useGoodsStore();
  const app = useAppStore();
  const cartStore = useCartStore();
  const router = useRouter();

  const timer = ref(null);

  // Функция-обработчик, которая переведет на новую страницу
  function redirect() {
    router.push('hello');
    cartStore.clearCart();
  }

  onMounted(() => {
    goodsStore.setLocale('ru');
    // Запускаем таймер
    timer.value = setInterval(redirect, 20000);

    // Обрабатываем события
    document.addEventListener("mousemove", () => {
      clearTimeout(timer.value);
      timer.value = setInterval(redirect, 20000);
    });
    document.addEventListener("keydown", () => {
      clearTimeout(timer.value);
      timer.value = setInterval(redirect, 20000);
    });
    document.addEventListener("click", () => {
      clearTimeout(timer.value);
      timer.value = setInterval(redirect, 20000);
    });
    document.addEventListener("scroll", () => {
      clearTimeout(timer.value);
      timer.value = setInterval(redirect, 20000);
    });
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
          <ProductCard
            :images="good.images"
            :alt="good.name"
            :title="good.name"
            :price="good.price"
            :stock="good.stock"
            :description="good.description"
            :itemId="good.id"
          />
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
