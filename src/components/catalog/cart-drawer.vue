<script setup>
  import { evaArrowBack, evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import i18next, { t } from 'i18next';
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import IconButton from '../buttons/icon-button.vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import DividerThin from '../dividers/divider-thin.vue';
import { useQuasar } from 'quasar';
import { apiReportsGetView, wsSendMessage,printDocument } from 'src/services';

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
      const {documentId} = await cartStore.submitOrder()
      await printDocument({documentId, $q})

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
    :width="1200"
  >
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">

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
        <div class="cart_product_item row" v-for="(item, index) in cartStore.cartExtended" :key="index">
          <div class="col-3 q-pr-md">
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
                <h4 class='q-mx-md q-my-none'>{{ item.quant }}</h4>
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
        <div class="text-h2">{{ $t('total') }}</div>
        <div class="text-h2 q-mb-md">
          {{ cartStore.totalPrice }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-md" />
        <div class="text-h4 row q-gutter-sm text-weight-regular">
          <span>{{ $t('order') }}</span>
          <span>{{ cartStore.totalQuantity }}</span>
          <span>{{ $t('pieces', { count: cartStore.totalQuantity }) }}</span>
        </div>
      </div>
      <div class="full-width" v-show="cartStore.cart.length">
        <RectangularButton
          class="fit"
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
            <div class="text-h2 text-uppercase text-center text-weight-bold">
              {{$t('order_was_successfully_completed')}}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center">
            <q-img src="public/girl.svg" max-width="100%" max-height="100%" width="25rem" height="25rem" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle2 text-center text-weight-bold">
              {{$t('contact_seller_for_further_information')}}
            </div>
            <DividerBold class="q-mb-lg" />
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
