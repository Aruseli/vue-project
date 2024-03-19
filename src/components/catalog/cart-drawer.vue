<script setup>
  import { evaArrowBack, evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { t } from 'i18next';
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import IconButton from '../buttons/icon-button.vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import DividerThin from '../dividers/divider-thin.vue';
import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const router = useRouter();

  const app = useAppStore();
  const cartStore = useCartStore();

  // // Если успользовать loading на кнопку Заказа, то при нажатии на кнопку будет отображаться прогресс загрузки
  // const progress = ref({ loading: false, percentage: 0 });
  // const interval = null;
  // const emulateLoading = (progress) => {
  // // Установить флаг загрузки в true
  //   progress.value.loading = true;

  //   // Запустить таймер обратного отсчета
  //   const timer = setInterval(() => {
  //     // Увеличить процент загрузки
  //     progress.value.percentage += 1;

  //     // Если процент загрузки достиг 100, остановить таймер и установить флаг загрузки в false
  //     if (progress.value.percentage === 100) {
  //       clearInterval(timer);
  //       progress.value.loading = false;
  //     }
  //   }, 1000);
  // }

  const closeDrawerCart = () => {
    app.openDrawerCart(false)
  }

  const isDisabled = ref(false);

  async function submitOrder() {
    // orderStore.existOrder();
    // кнопка будет недоступна для повторного клика
    isDisabled.value = true;
    // emulateLoading(progress);
    try {
      await cartStore.submitOrder()
      app.openOrderDialog(true);
      setTimeout(() => {
        router.push('hello');
      }, app.kioskState.settings?.customer_successful_order_notify_duration_ms ?? 7000);
    } catch (err) {
      console.error('ordersStore.selectOrder error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_submit_order'),
        timeout: 6000,
      })
    } finally {
      isDisabled.value = false
    }
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
    :width="900"
  >
    <div class="q-pa-lg-md q-pa-xs-sm">
      <div class="row items-center q-mb-lg-md q-mb-xs-xs">

        <IconButton
          round
          :icon="evaArrowBack"
          @click="closeDrawerCart"
          class="q-pa-xs back_button col-1"
        />
        <div class="text-h2 text-center text-text text-uppercase col-10">
          {{ $t('order') }}
        </div>
      </div>
      <div class="bg-negative full-width" style="height: 0.1rem" />
    </div>

    <div v-if="!cartStore.cart.length" class="q-pa-lg-md q-pa-xs-sm text-center">
      <div class="text-h2">{{ $t('empty_cart') }}</div>
    </div>

    <q-scroll-area class="fit">
      <div class="row container_settings">
        <div class="cart_product_item row" v-for="(item, index) in cartStore.cartExtended" :key="index">
          <div class="col-3 q-pr-sm">
            <q-img
              :src="item.image"
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

          <div class="column justify-between col-9">
            <div class="row justify-between items-center">
              <div class="text-h3 text-weight-regular">
                {{ item.title }}
              </div>
              <q-btn unelevated round @click="cartStore.removeFromCart(item.id)">
                <q-icon name="img:/bin.svg" size="2.5rem" />
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
                <div class='text-h4 q-mx-lg-md q-mx-xs-sm q-my-none'>{{ item.quant }}</div>
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

    <div class="q-pa-lg-md q-pa-xs-sm bg-white">
      <DividerBold class="q-mb-lg-md q-mb-xs-sm" />
      <div class="row justify-between items-center">
        <div class="q-mb-lg-md q-mb-xs-sm row justify-between fit">
          <div class="text-h3">{{ $t('total') }}</div>
          <div class="text-h3">
            {{ cartStore.totalPrice }} &ensp;&#3647
          </div>
        </div>
        <DividerThin class="bg-negative q-mb-sm" />
        <div class="text-h4 row q-gutter-sm text-weight-regular">
          <span>{{ $t('order') }}</span>
          <span>{{ cartStore.totalQuantity }}</span>
          <span>{{ $t('pieces', { count: cartStore.totalQuantity }) }}</span>
        </div>
      </div>
      <div class="full-width" v-show="cartStore.cart.length">
        <RectangularButton
          class="fit q-py-xs-sm"
          :name="$t('checkout')"
          :disable="isDisabled"
          @click="submitOrder"
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
            <div class="text-h3 text-uppercase text-center text-weight-bold">
              {{$t('order_was_successfully_completed')}}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center">
            <q-img src="public/girl.svg" max-width="100%" max-height="100%" class="img_style" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle2 text-center text-weight-bold">
              {{$t('contact_seller_for_further_information')}}
            </div>
            <DividerBold class="q-mb-md" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-h1 text-center text-uppercase text-weight-bold">
              {{$t('thank_you')}}
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
    @media(max-width: 1300px) {
      padding: 1.5rem;
    }
    @media(max-width: 900px) {
      padding: 1rem;
    }
  }

  .container_settings > *:not(:last-of-type) {
    margin-bottom: var(--px30);
    @media(max-width: 1300px) {
      margin-bottom: 1rem;
    }
  }
  .container_settings > *:last-of-type {
    margin-bottom: var(--px60);
    @media(max-width: 1300px) {
      margin-bottom: var(--px30);
    }
    @media(max-width: 900px) {
      margin-bottom: 1rem;
    }
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

  .dialog_cart {
    padding: 5rem;
    @media(max-width: 1300px) {
      padding: 1.5rem;
    }
    @media(max-width: 900px) {
      padding: 1rem;
    }
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

  .back_button {
    width: 5rem;
    height: 5rem;
    @media (max-width: 1300px) {
      width: 3rem;
      height: 3rem;
    }
  }
  .img_style {
    width: 25rem;
    height: 25rem;
    @media(max-width: 1300px) {
      width: 15rem;
      height: 15rem;
    }
    @media(max-width: 900px) {
      width: 10rem;
      height: 10rem;
    }
    @media(max-width: 500px) {
      width: 7rem;
      height: 7rem;
    }
  }
</style>
