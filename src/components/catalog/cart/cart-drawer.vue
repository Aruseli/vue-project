<script setup lang="ts">
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
  <Drawer
    @click="closeDrawerCart"
    :isOpen="app.drawerCartState"
  >
    <div class="full-height">

      <div class="q-mb-lg-md q-mb-xs-sm">
        <div class="row items-center justify-between q-mb-lg-md q-mb-xs-xs">

          <!-- design_v2 -->
          <IconButton
            round
            :icon="evaArrowBack"
            @click="closeDrawerCart"
            class="q-pa-xs back_button col-1"
          />
          <!-- end  -->

          <div class="text-h2 text-center text-text text-uppercase col-10">
            {{ $t('order') }}
          </div>

          <!-- close + bin -->
          <div class="row cart_buttons">
            <q-btn flat round @click="cartStore.clearCart()" class="q-mr-sm">
              <q-icon name="img:/bin.svg" size="2.5rem" class="text-black" />
            </q-btn>
          </div>
        </div>
        <div class="bg-negative full-width" style="height: 0.1rem" />
      </div>

      <div v-if="!cartStore.cart.length" class="q-pa-lg-md q-pa-xs-sm text-center">
        <div class="text-h2">{{ $t('empty_cart') }}</div>
      </div>

      <q-scroll-area class="fit">
        <div class="row container_settings">

          <!-- flex row container -->
          <div
            v-for="(item, index) in cartStore.cartExtended" :key="index"
            class="cart_product_item row"
          >

            <!-- image -->
            <div class="col-3 q-mr-xl">
              <q-img
                :src="item.image"
                :ration="1"
                height="150px"
                fit="none"
              >
                <template #loading>
                  <div class="text-subtitle1 text-black">
                    Loading...
                  </div>
                </template>
              </q-img>
            </div>

            <!-- container for title + price + buttons -->
            <div class="row justify-between full-width">
              <!-- title + price -->
              <div class="column justify-evenly">
                  <!-- title -->
                  <div class="text-h4 text-weight-regular">
                    {{ item.title }}
                  </div>
                  <!-- price -->
                  <div class="row items-baseline">
                    <span class="text-h3 q-mr-xs">
                      &#3647&ensp;{{ item.price * item.quant }}
                    </span>
                    <span class="text-h4 q-mr-xs">/</span>
                    <span class="text-h5 text-grey-3">
                      &#3647&ensp;{{ item.price }}
                    </span>
                  </div>
              </div>


              <!-- buttons -->
              <div class="column justify-between items-end">
                <q-btn flat round @click="cartStore.removeFromCart(item.id)">
                  <q-icon name="img:/bin.svg" size="2.5rem" />
                </q-btn>

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

      <div class="full-width total_style pa-20" v-if="cartStore.cart.length">

        <!-- desing_v2 -->
        <DividerBold class="q-mb-lg-md q-mb-xs-sm"  />
        <!-- end -->

        <div :class="[cartStore.cart.length > 0 ? 'q-mb-lg-md q-mb-xs-sm' : 'q-mb-none row justify-between items-center']">

          <div class="q-mb-lg-lg q-mb-xs-sm row justify-between fit text-h3">
            <div>{{ $t('total') }}</div>
            <div>
              {{ cartStore.totalPrice }} &ensp;&#3647
            </div>
          </div>

          <!-- desing_v2 -->
          <DividerThin class="bg-negative q-mb-sm" />
          <!-- end -->

          <!-- design_v2 -->
          <div
            class="text-h4 row q-gutter-x-sm text-weight-regular"
            v-if="app.kioskState.settings?.alt_ui == 'design_v2'"
          >
            <span>{{ $t('order') }}</span>
            <span>{{ cartStore.totalQuantity }}</span>
            <span>{{ $t('pieces', { count: cartStore.totalQuantity }) }}</span>
          </div>
          <!-- end -->

        </div>
        <div
          class="full-width"
          v-show="cartStore.cart.length"
        >
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

<style>

.cart_buttons {
    top: var(--px14);
    right: var(--px14);
  }
  .cart_close_button {
    /* font-size: 66px; */
  }
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
    justify-content: flex-start;
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    padding: var(--px20);
  }

  .cart_product_item_v3 {
    box-shadow: none;
    border-radius: var(--border-xxs);
  }
  .back_button {
    width: 5rem !important;
    height: 5rem !important;
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
