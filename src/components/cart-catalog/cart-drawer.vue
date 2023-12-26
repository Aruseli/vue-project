<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { useCartStore } from 'src/stores/cart';
  import { useAppStore } from 'src/stores/app';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const { t } = useI18n();

  const cartStore = useCartStore();
  const app = useAppStore();

  // Инициализируем реактивные переменные для хранения общего количества и общей стоимости
  const totalCount = ref(0);
  const totalPrice = ref(0);

   // Функция для подсчета общего количества и общей стоимости
   const calculateTotal = () => {
    totalCount.value = cartStore.cart.reduce((acc, item) => acc + item.count, 0);
    totalPrice.value = cartStore.cart.reduce((acc, item) => acc + item.count * item.price, 0);
  };

  // Вычисляемые свойства для общего количества и общей стоимости
  const totalQuantity = computed(() => {
    return cartStore.cart.reduce((total, item) => total + item.count, 0);
  });

  const totalCost = computed(() => {
    return cartStore.cart.reduce((total, item) => total + item.price, 0);
  });

  // Вызываем функцию при монтировании компонента
  onMounted(() => {
    calculateTotal();
  });

  const closeDrawerCart = () => {
    app.openDrawerCart(false)
  }

  const openOrderDialog = () => {
    app.openOrderDialog(true)
    // setTimeout(() => {
    //   router.push('hello');
    // }, 2000);
  }

  const removeFromCart = (id) => {
    cartStore.cart = cartStore.cart.filter(item => item.id !== id)
  }

</script>


<template>
  <q-drawer
    dark="true"
    v-model="app.drawerCartState"
    side="right"
    overlay
    elevated
    behavior="mobile"
    width="1200"
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
        <div class="text-subtitle1 text-center text-weight-bold text-text text-uppercase col-11">
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
              :src="item.images[0]"
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
          <!-- <div>
            <q-carousel
              transition-prev="slide-right"
              transition-next="slide-left"
              v-model="slide"
              :navigation-icon="ionEllipse"
              control-color="primary"
              swipeable
              animated
              infinite
              navigation
              class="bg-white shadow-1 round-borders fit"
            >
              <q-carousel-slide
                v-for="(image, index) in item.images"
                :key="index"
                :name="index"
                class="column no-wrap flex-center"
              >
                <div style="width: 300px; height: 200px;">
                  <q-img
                    :src="image"
                    :ration="4/3"
                  >
                    <template #loading>
                      <div class="text-subtitle1 text-black">
                        Loading...
                      </div>
                    </template>
                  </q-img>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div> -->

          <div class="column justify-between col-8">
            <div class="row justify-between items-center">
              <div class="text-h2 text-weight-regular">
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
                {{ item.price }}&ensp;THB
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
      <div class="bg-secondary full-width q-mb-lg" style="height: 0.3rem" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-subtitle1">{{t('total')}}</div>
        <div class="text-subtitle1 q-mb-md">
          {{ totalCost }} &ensp;THB
        </div>
        <div class="bg-negative full-width q-mb-lg" style="height: 0.1rem" />
        <div class="text-subtitle2 order_container text-weight-regular">
          <span>{{t('order')}}</span>
          <span>{{ totalQuantity }}</span>
          <span>{{ t('pieces') }}</span>
        </div>
      </div>
      <div class="full-width">
        <q-btn
          class="full-width text-style q-py-lg"
          unelevated
          rounded
          no-caps
          color="accent"
          @click="openOrderDialog"
          >
          <div class="text-subtitle1 text-center text-weight-bold text-header_bg text-uppercase">
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
      dark="true"
    >
      <div class="dialog_container">
        <q-card class="dialog_card dialog_cart">
          <q-card-section>
            <div class="text-h2 text-uppercase text-center text-weight-bold">
              {{t('the_order_was_successfully_completed')}}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center">
            <q-img src="src/assets/girl.svg" max-width="100%" max-height="100%" width="25rem" height="25rem" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle2 text-center text-weight-bold">
              {{t('contact_seller_for_further_information')}}
            </div>
            <div class="bg-secondary full-width q-mb-lg" style="height: 0.3rem" />
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
