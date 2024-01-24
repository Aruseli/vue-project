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

  // Функция проверки взаимодействия пользователя со страницей
  function isUserActive() {
    return (
      document.body.clickCount > 0 ||
      document.body.touchCount > 0 ||
      document.body.scrollTop > 0 ||
      document.body.scrollLeft > 0
    );
  }

  // Функция-обработчик, которая переведет на новую страницу
  function redirect() {
    router.push('hello');
  }

  // Сохраняем время начала таймера
  const startTime = ref(Date.now());

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

  const showNotify = () => {
    $q.notify({
      color: 'warning',
      icon: 'warning',
      position: 'center',
      message: "Ваша корзина будет очищена через 1 минуту.",
      timeout: 2000,
    })
  }


  // Проверяем, есть ли товары в корзине
  if (cartStore.cart.length) {

    // Проверяем, не прошло ли 15 минут
    if (Date.now() - startTime < 15000) {
    // Запускаем таймер на 15 минут
      timer.value = setInterval(() => {
        // Показываем сообщение о том, что корзина будет очищена
        showNotify();
      }, 5000);
    // Останавливаем таймер
    clearTimeout(timer.value);
    // Очищаем корзину
    cartStore.clearCart();

  }
  // Обрабатываем событие нажатия кнопки Купить
// const onClickBuy = () => {
//   // Останавливаем таймер
//   clearTimeout(timer.value);
//   // Очищаем корзину
//   clearCart();
// };
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
