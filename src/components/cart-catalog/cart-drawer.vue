<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { evaArrowBack, evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { useCartStore } from 'src/stores/cart';
  import { useAppStore } from 'src/stores/app';
  import { useRouter } from 'vue-router';
  import DividerBold from '../dividers/divider-bold.vue';
  import DividerThin from '../dividers/divider-thin.vue';
  import { useOrderStore } from 'src/stores/order';
  import IconButton from '../buttons/icon-button.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import { apiSaveDocument } from 'src/services';


  const router = useRouter();

  const { t } = useI18n();

  const cartStore = useCartStore();
  const appStore = useAppStore();
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

  const terminal_settings = appStore.kioskState.params?.terminal_settings;

  function createDoc(cartItem) {
    return {
      id: undefined, // Предположим, что это поле заполняется на сервере
      state: 2,
      doc_type: terminal_settings?.invoice_doc_type_id ?? '',
      abbr_text: undefined,
      abbr_num: undefined,
      doc_date: new Date().toISOString(),
      doc_order: 0,
      corr_from_ref: terminal_settings?.kiosk_corr_id ?? '',
      corr_to_ref: terminal_settings?.client_corr_id ?? '',
      respperson_ref: appStore.kioskState.user?.id ?? '',
      currency_ref: terminal_settings?.currency_id ?? '',
      curr_rate: 1,
      comment: undefined,
      details: cartStore.cart.map((item, index) => ({
        state: 0,
        rec_order: index + 1,
        munit_id: terminal_settings?.munit_id ?? '',

        doc_detail_type: terminal_settings?.invoice_docdetail_type_id ?? '',
        quant: item.count,
        good_id: item.id,
        total: item.price,
      }))
    };
  }
  const docsToBeSent = cartStore.cart.reduce((obj, item) => {
    obj = createDoc(item);
    return obj;
  }, {});

  function openOrderDialog() {
    orderStore.existOrder();
    // кнопка будет недоступна для повторного клика
    isDisabled.value = true;
    // emulateLoading(progress);
    app.openOrderDialog(true);
    console.log(cartStore.cart);
    console.log(docsToBeSent);
    apiSaveDocument(docsToBeSent);
    setTimeout(() => {
      cartStore.clearCart();
    }, 2000);
    setTimeout(() => {
      router.push('hello');
    }, 7000);
  }

  const removeFromCart = (id) => {
    cartStore.cart = cartStore.cart.filter(item => item.id !== id)
  }

  onMounted(() => {
    console.log('cartStore.cart', cartStore.cart)
  })

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
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">
        <!-- <q-btn
          unelevated round
          @click="closeDrawerCart"
          class="q-pa-md col-1"
        >
          <q-icon name="arrow_back" class="round-button-light_green" />
        </q-btn> -->
        <IconButton
          round
          :icon="evaArrowBack"
          @click="closeDrawerCart"
          class="q-pa-xs"
        />
        <div class="text-h1 text-center text-text text-uppercase col-11">
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
                &#3647&ensp;{{ item.price }}
              </div>
              <div class="row justify-between items-center">
                <IconButton
                  round
                  :icon="evaPlusOutline"
                  @click="() => cartStore.increaseItemsCount(item)"
                  class="q-pa-xs"
                />
                <h4 class='q-mx-md q-my-none'>{{ item.count }}</h4>
                <IconButton
                  round
                  :icon="evaMinusOutline"
                  @click="() => cartStore.decreaseItemsCount(item)"
                  class="q-pa-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>

    <div class="q-pa-md bg-white">
      <DividerBold class="q-mb-md" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h2">{{t('total')}}</div>
        <div class="text-h2 q-mb-md">
          {{ cartStore.totalCost }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-md" />
        <div class="text-h4 order_container text-weight-regular">
          <span>{{t('order')}}</span>
          <span>{{ cartStore.totalQuantity }}</span>
          <span>{{ t('pieces') }}</span>
        </div>
      </div>
      <div class="full-width" v-show="cartStore.cart.length">
        <RectangularButton
          class="fit"
          name="checkout"
          :disable="isDisabled"
          @click="openOrderDialog"
        />
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
