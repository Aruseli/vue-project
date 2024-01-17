<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { useCartStore } from 'src/stores/cart';
  import { useAppStore } from 'src/stores/app';
  import { useRouter } from 'vue-router';
  import DividerBold from '../dividers/divider-bold.vue';
  import DividerThin from '../dividers/divider-thin.vue';
  import { useOrderStore } from 'src/stores/order';

  const router = useRouter();

  const { t } = useI18n();

  const cartStore = useCartStore();
  const orderStore = useOrderStore();
  const app = useAppStore();

  // Инициализируем реактивные переменные для хранения общего количества и общей стоимости
  const totalCount = ref(0);
  const totalPrice = ref(0);

   // Функция для подсчета общего количества и общей стоимости
   const calculateTotal = () => {
    totalCount.value = cartStore.cart.reduce((acc, item) => acc + item.count, 0);
    totalPrice.value = cartStore.cart.reduce((acc, item) => acc + item.count * item.price, 0);
  };

  // Если успользовать loading на кнопку Заказа, то при нажатии на кнопку будет отображаться прогресс загрузки
  const progress = ref({ loading: false, percentage: 0 });
  const interval = null;
  const emulateLoading = (progress) => {
  // Установить флаг загрузки в true
    progress.value.loading = true;

    // Запустить таймер обратного отсчета
    const timer = setInterval(() => {
      // Увеличить процент загрузки
      progress.value.percentage += 1;

      // Если процент загрузки достиг 100, остановить таймер и установить флаг загрузки в false
      if (progress.value.percentage === 100) {
        clearInterval(timer);
        progress.value.loading = false;
      }
    }, 1000);
  }

  // Вызываем функцию при монтировании компонента
  onMounted(() => {
    calculateTotal();
  });

  const closeDrawerCart = () => {
    app.openDrawerCart(false)
  }

  const isDisabled = ref(false);

  function openOrderDialog() {
    orderStore.existOrder();
    // кнопка будет недоступна для повторного клика
    isDisabled.value = true;
    // emulateLoading(progress);
    app.openOrderDialog(true);
    setTimeout(() => {
      cartStore.clearCart();
    }, 2000);
    // setTimeout(() => {
    //   router.push('hello');
    // }, 7000);
  }

  const removeFromCart = (id) => {
    cartStore.cart = cartStore.cart.filter(item => item.id !== id)
  }

</script>


<template>
  <q-drawer
    dark
    v-model="app.drawerCartState"
    side="right"
    overlay
    elevated
    behavior="mobile"
    :width="1200"
  >
    <div class="q-px-lg">
      <div class="row items-center">
        <q-btn
          unelevated round
          @click="closeDrawerCart"
          class="q-pa-md col-1"
        >
          <q-icon name="arrow_back" class="round-button-light_green" />
        </q-btn>
        <div class="text-h3 text-center text-weight-bold text-text text-uppercase col-11">
          {{ $t('order') }}
        </div>
      </div>
      <div class="bg-negative full-width" style="height: 0.1rem" />
    </div>

    <div v-if="!cartStore.cart.length" class="q-pa-lg text-center">
      <h2>{{ $t('empty_cart') }}</h2>
    </div>

    <q-scroll-area class="fit">
      <div class="row container_settings">
        <div class="cart_product_item row" v-for="(item, index) in cartStore.cart" :key="index">
          <div class="col-4 q-pr-md">
            <q-img
              :src="item.images[0].image"
              ration="16/9"
              height="150px"
              fit="unset"
            >
              <template #loading>
                <div class="text-subtitle1 text-black">
                  Loading...
                </div>
              </template>
            </q-img>
          </div>

          <div class="column justify-between col-8">
            <div class="row justify-between items-center">
              <div class="text-h3 text-weight-regular">
                {{ item.title }}
              </div>
              <q-btn unelevated round @click="removeFromCart(item.id)">
                <q-icon name="img:src/assets/bin.svg" size="2.5rem" />
              </q-btn>
            </div>

            <!-- <div class="text-body1 text-weight-regular">
              {{ item.description }}
            </div> -->
            <div class="row justify-between items-center">
              <div class="text-h3">
                {{ item.price }}&ensp;&#3647
              </div>
              <div class="row justify-between items-center">
                <q-btn unelevated round
                  @click="() => cartStore.increaseItemsCount(item)" class='q-mr-lg'>
                  <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
                </q-btn>
                <h4 class='q-mr-lg q-my-none'>{{ item.count }}</h4>
                <q-btn unelevated round
                @click="() => cartStore.decreaseItemsCount(item)">
                  <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>

    <div class="q-pa-lg bg-white">
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-body1">{{t('total')}}</div>
        <div class="text-body1 q-mb-md">
          {{ cartStore.totalCost }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-lg" />
        <div class="text-body1 order_container text-weight-regular">
          <span>{{t('order')}}</span>
          <span>{{ cartStore.totalQuantity }}</span>
          <span>{{ t('pieces') }}</span>
        </div>
      </div>
      <div class="full-width" v-show="cartStore.cart.length">
        <q-btn
          class="full-width text-style q-py-lg"
          unelevated
          rounded
          no-caps
          color="accent"
          :disable="isDisabled"
          @click="openOrderDialog"

          >
          <div class="text-h3 text-white text-center text-weight-bold text-header_bg text-uppercase">
            {{ $t('order') }}
          </div>
        </q-btn>
      </div>
    </div>

  </q-drawer>

  <template>
    <q-dialog
      v-model="app.orderDialog"
      transition-hide="fade"
      transition-show="fade"
      transition-duration="1.8"
      dark
    >
      <div class="dialog_container">
        <q-card class="dialog_card dialog_cart">
          <q-card-section>
            <div class="text-h2 text-uppercase text-center text-weight-bold">
              {{t('order_was_successfully_completed')}}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center">
            <q-img src="src/assets/girl.svg" max-width="100%" max-height="100%" width="25rem" height="25rem" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle2 text-center text-weight-bold">
              {{t('contact_seller_for_further_information')}}
            </div>
            <DividerBold class="q-mb-lg" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-h1 text-center text-uppercase text-weight-bold">
              {{t('thank_you')}}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </template>
</template>

<style scoped>
  .container_settings {
    padding: var(--px43);
  }

  .container_settings > *:not(:last-of-type) {
    margin-bottom: var(--px30);
  }
  .container_settings > *:last-of-type {
    margin-bottom: var(--px60);
  }
  .cart_product_item {
    width: 100%;
    height: max-content;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    padding: var(--px20);
  }
  .cart_product_item > *:first-of-type {
    /* margin-right: 2rem; */
  }

  .order_container > span:not(:last-of-type) {
    margin-right: 1rem;
  }

  .dialog_cart {
    padding: 5rem;
  }

  .dialog_cart > *:nth-child(1) {
    margin-bottom: 5rem;
  }
  .dialog_cart > *:nth-child(2) {
    margin-bottom: 1.5rem;
  }
  .dialog_cart > *:nth-child(2) {
    margin-bottom: 3rem;
  }
  .dialog_container {
    width: 70vw;
    max-width: 80vw;
    height: max-content;
  }
</style>
