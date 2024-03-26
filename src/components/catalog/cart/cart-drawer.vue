<script setup>
  import { evaArrowBack, evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
import { t } from 'i18next';
import { useAppStore } from 'src/stores/app';
import { useCartStore } from 'src/stores/cart';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import IconButton from '../../buttons/icon-button.vue';
import RectangularButton from '../../buttons/rectangular-button.vue';
import DividerBold from '../../dividers/divider-bold.vue';
import DividerThin from '../../dividers/divider-thin.vue';
import { useQuasar } from 'quasar';
import Drawer from '../../overlay/drawer.vue';
import OrderCheck from './order-check.vue';

  const $q = useQuasar();
  const router = useRouter();

  const app = useAppStore();
  const cartStore = useCartStore();

  const closeDrawerCart = () => {
    app.openDrawerCart(false)
  }

  const isDisabled = ref(false);

  async function submitOrder() {
    // кнопка будет недоступна для повторного клика
    isDisabled.value = true;
    try {
      await cartStore.submitOrder()
      app.openOrderDialog(true);
      setTimeout(() => {
        app.openOrderDialog(false);
        closeDrawerCart();
        cartStore.clearCart();
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
  <Drawer @click="closeDrawerCart" :isOpen="app.drawerCartState">
    <div class="relative-position full-height">

      <div class="q-mb-lg-md q-mb-xs-sm">
        <div class="row items-center justify-between q-mb-lg-md q-mb-xs-xs">

          <IconButton
            round
            :icon="evaArrowBack"
            @click="closeDrawerCart"
            class="q-pa-xs back_button col-1"
          />
          <div class="text-h2 text-center text-text text-uppercase col-10">
            {{ $t('order') }}
          </div>
          <q-btn unelevated round @click="cartStore.clearCart()">
            <q-icon name="img:/bin.svg" size="2.5rem" />
          </q-btn>
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

              <div class="row justify-between items-center">
                <div class="row items-baseline">
                  <span class="text-h3 q-mr-xs">
                    &#3647&ensp;{{ item.price * item.quant }}
                  </span> <span class="text-h3 q-mr-xs">/</span>
                  <span class="text-h5 text-blue-grey-4">
                    &#3647&ensp;{{ item.price }}
                  </span>
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

      <div class="full-width total_style" v-if="cartStore.cart.length">
        <DividerBold class="q-mb-lg-md q-mb-xs-sm" />
        <div :class="[cartStore.cart.length > 0 ? 'q-mb-lg-md q-mb-xs-sm' : 'q-mb-none row justify-between items-center' ]">
          <div class="q-mb-lg-md q-mb-xs-sm row justify-between fit">
            <div class="text-h3">{{ $t('total') }}</div>
            <div class="text-h3">
              {{ cartStore.totalPrice }} &ensp;&#3647
            </div>
          </div>
          <DividerThin class="bg-negative q-mb-sm" />
          <div class="text-h4 row q-gutter-x-sm text-weight-regular">
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
    </div>
  </Drawer>

  <template>
    <OrderCheck />
  </template>
</template>

<style scoped>
  .container_settings {
    padding: 0.3rem;
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
  .back_button {
    width: 5rem;
    height: 5rem;
    @media (max-width: 1300px) {
      width: 3rem;
      height: 3rem;
    }
  }
  .total_style {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: max-content;
  }
</style>
