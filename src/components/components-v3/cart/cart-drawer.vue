<script setup lang="ts">
  import { evaMinusOutline, evaPlusOutline } from '@quasar/extras/eva-icons';
  import { t } from 'i18next';
  import { useQuasar } from 'quasar';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '../../../stores/app';
  import { useCartStore } from '../../../stores/cart';
  import IconButton from '../../buttons/icon-button.vue';
  import RectangularButton from '../../buttons/rectangular-button.vue';
  import OrderCheck from './order-check.vue';
  import DividerThin from '../../dividers/divider-thin.vue';

  const $q = useQuasar();
  const router = useRouter();

  const app = useAppStore();
  const cartStore = useCartStore();

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
      default:false,
    },
    additionalCartClass: {
      type: String,
      default: ''
    }
  })

  const closeDrawerCart = () => {
    app.openDrawerCart(false)
  }

  const isDisabled = ref(false);
//app.kioskState.settings?.customer_successful_order_notify_duration_ms ??
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
      },  700000);
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

  const emit = defineEmits(['click']);
</script>

<template>
  <transition name="drawer_animation">
    <div class="drawer_style_v3 bg-grey-3" :class="props.additionalCartClass" v-if="props.isOpen">
      <transition mode="out-in">
        <div v-if="app.orderDialog == false" class="full-height">
          <div class="full-height q-pa-xl">

            <div class="q-mb-lg-md q-mb-xs-sm">
              <div class="row items-center justify-between q-mb-lg-md q-mb-xs-xs">
                <div class="text-h1 text-left text-white text-uppercase col-10  text-weight-bold">
                  {{ $t('order') }}
                </div>

                <!-- close + bin -->
                <div class="row absolute cart_buttons">
                  <q-btn flat round @click="cartStore.clearCart()" class="q-mr-sm">
                    <q-icon name="img:/bin.svg" size="2.5rem" class="text-grey" />
                  </q-btn>
                  <IconButton
                    icon="close"
                    textColor="grey"
                    :rounded="false"
                    :round="true"
                    :flat="true"
                    size="xl"
                    class="cart_close_button"
                    @click="closeDrawerCart"
                  />
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
                  class="cart_product_item_v3 bg-grey-1 row pa-20"
                >

                  <!-- image -->
                  <div class="col-3 q-mr-xl">
                    <q-img
                      :src="item.image"
                      :ration="1"
                      height="150px"
                      fit="none"
                      class="img_style_v3"
                    >
                      <template #loading>
                        <div class="text-subtitle1 text-black">
                          Loading...
                        </div>
                      </template>
                    </q-img>
                  </div>

                  <!-- container for title + price + buttons -->
                  <div class="row justify-between col">
                    <!-- title + price -->
                    <div class="column justify-evenly">
                        <!-- title -->
                        <div
                          class="text-h3 text-green text-weight-bold first_letter"
                        >
                          {{ item.title }}
                        </div>
                        <!-- price -->
                        <div class="row items-baseline">
                          <span
                            class="text-white text-weight-bold text-h2 q-mr-xs"
                          >
                            &#3647&ensp;{{ item.price * item.quant }}
                          </span>
                          <span class="q-mr-xs text-white text-weight-bold text-h3">/</span>
                          <span class="text-grey text-weight-bold text-h4">
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
                          iconStyle="text-grey-1"
                          :icon="evaPlusOutline"
                          @click="() => cartStore.increaseItemsCount(item)"
                          class="q-pa-xs bg-white"
                        />
                        <div
                          class='text-h2 text-white q-mx-lg-md q-mx-xs-sm q-my-none'
                        >{{ item.quant }}</div>
                        <IconButton
                          round
                          class="bg-white q-pa-xs"
                          iconStyle="text-grey-1"
                          :icon="evaMinusOutline"
                          @click="() => cartStore.decreaseItemsCount(item)"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </q-scroll-area>

            <div class="full-width total_style bg-grey-3" v-if="cartStore.cart.length">
              <div
                class="q-mb-sm"
                :class="[cartStore.cart.length > 0 ? 'q-mb-lg-md q-mb-xs-sm' : 'q-mb-none row justify-between items-center']">

                <DividerThin class="bg-white mb-20" />

                <div
                  class="text-white text-h2 q-px-xl no-margin row justify-between fit"
                >
                  <div>{{ $t('total') }}</div>
                </div>

                <div class="text-white row justify-between q-px-xl">
                  <div
                    class="text-h3 row text-weight-regular q-gutter-x-sm text-white items-center"
                  >
                    <span>{{ $t('order') }}</span>
                    <span>{{ cartStore.totalQuantity }}</span>
                    <span>{{ $t('pieces', { count: cartStore.totalQuantity }) }}</span>
                  </div>
                  <div class="text-h2">
                    {{ cartStore.totalPrice }} &ensp;&#3647
                  </div>
                </div>

              </div>
              <div
                class="full-width q-px-xl q-pb-xl"
                v-show="cartStore.cart.length"
              >
                <RectangularButton
                  class="fit q-py-xs-sm"
                  :name="$t('checkout')"
                  :disable="isDisabled"
                  @click="submitOrder"
                  :rounded="false"
                  color="white"
                  textColor="grey-3"
                  classTitle="text-h4 text-weight-bold"
                />
              </div>
            </div>
          </div>
        </div>
        <OrderCheck v-else-if="app.orderDialog == true" />
      </transition>
    </div>
  </transition>
  <transition name="backdrop_animation">
    <div class="drawer_backdrop" v-if="props.isOpen" @click="emit('click')" />
  </transition>

</template>

<style scoped>
  .drawer_backdrop {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cart_buttons {
    top: var(--px14);
    right: var(--px14);
  }
  .cart_close_button {
    /* font-size: 66px; */
  }
  .img_style_v3 {
    border-radius: 0 !important;
  }
  .drawer_style_v3 {
    z-index: 199;
    position: absolute;
    right: 0; top: 0;
    box-sizing: border-box;
    max-width: 70vw;
    min-width: 30vw;
    width: 50vw;
    height: 100%;
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

  .cart_product_item_v3 {
    width: 100%;
    box-shadow: none;
    border-radius: var(--border-xxs);
  }
  .total_style {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: max-content;
  }

  .drawer_animation-enter-active,
  .drawer_animation-leave-active {
    transition: all 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
  }

  .drawer_animation-leave-to,
  .drawer_animation-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .backdrop_animation-enter-active {
    transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
  }
  .backdrop_animation-leave-active {
    transition: all 0.5s 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
  }

  .backdrop_animation-leave-to,
  .backdrop_animation-enter-from {
    opacity: 0;
  }
</style>
