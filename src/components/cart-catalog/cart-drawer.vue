<script setup>
  import { productsStore } from '../../stores/store';
  import { ref, computed, onMounted, watch } from 'vue';
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const store = productsStore();
  const slide = ref(0);
  const openOrderDialog = ref(false);

  // Получаем массив из store
  const cart = store.cart;

  // Инициализируем реактивные переменные для хранения общего количества и общей стоимости
  const totalCount = ref(0);
  const totalPrice = ref(0);

  // Функция для подсчета общего количества и общей стоимости
  const calculateTotal = () => {
    totalCount.value = cart.reduce((acc, item) => acc + item.count, 0);
    totalPrice.value = cart.reduce((acc, item) => acc + item.count * item.price, 0);
  };

  // Вычисляемые свойства для общего количества и общей стоимости
  const totalQuantity = computed(() => {
    return cart.reduce((acc, item) => acc + item.count, 0);
  });

  const totalCost = computed(() => {
    return cart.reduce((acc, item) => acc + item.count * item.price, 0);
  });

  // Вызываем функцию при монтировании компонента
  onMounted(() => {
    calculateTotal();
  });

  const closeDrawerCart = () => {
    store.openDrawerCart(false)
  }

  const orderDialog = () => {
    openOrderDialog.value = true;
  }

  const removeFromCart = (id) => {
    store.removeFromCart(id);
  }

  const price = computed(() => {
    let indexOfSize = props.product.sizes.map((item) => item.value).indexOf(selectedSize.value);
    if (indexOfSize === -1) {
      indexOfSize = 0;
    }
    return (props.product.price + indexOfSize * 10) * selectedCount.value;
  });
  // onMounted(() => {
  //   console.log('MOUNTED');
  //   store.fetchDataFromDB()
  // })
</script>


<template>
  <q-drawer
    dark="true"
    v-model="store.drawerCartState"
    side="right"
    overlay
    elevated

    behavior="mobile"
    width="900"
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

    <div v-if="!store.cart.length" class="q-pa-lg text-center">
      <h2>{{ $t('empty_cart') }}</h2>
    </div>
    <q-scroll-area class="fit">

      <div class="row container-settings">
        <div class="cart-product-item"  v-for="(item, index) in store.cart" :key="index">
          <div style="width: 200px; height: 100%;">
            <q-carousel
              transition-prev="slide-right"
              transition-next="slide-left"
              swipeable
              animated
              v-model="slide"
              control-color="primary"
              :navigation-icon="ionEllipse"
              navigation
              infinite
              class="bg-white shadow-1 round-borders fit"
            >
              <q-carousel-slide
                v-for="(image, index) in item.images"
                :key="index"
                :name="index"
                class="column no-wrap flex-center"
                style="height: auto; padding: 0;"
              >
                <div style="width: 200px; height: 200px;">
                  <q-img
                    :src="image"
                    style="width: 100%; height: 100%;"
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
          </div>

          <div class="column justify-between">
            <div class="row justify-between items-center">
              <div class="text-h2 text-weight-regular">
                {{ item.title }}
              </div>
              <q-btn unelevated round @click="removeFromCart(item.id)">
                <q-icon name="delete_forever" class="round-button-dark_green" />
              </q-btn>
            </div>

            <div class="text-body1 text-weight-regular">
              {{ item.description }}
            </div>
            <div class="row justify-between items-center">
              <div class="text-subtitle1">
                {{ item.price }}$
              </div>
              <div class="row justify-between items-center">
                <q-btn unelevated round @click="store.increaseItems(item)" class='q-mr-lg'>
                  <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
                </q-btn>
                <h5 class='q-mr-lg q-my-none'>{{ item.count }}</h5>
                <q-btn unelevated round @click="store.decreaseItems(item)">
                  <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>

    <div class="q-pa-lg">
      <div class="bg-secondary full-width q-mb-lg" style="height: 0.3rem" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-subtitle1">{{t('total')}}</div>
        <div class="text-subtitle1 q-mb-md">
          {{ totalCost }} &ensp;$
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
          @click="orderDialog"
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
      v-model="openOrderDialog"
      transition-hide="fade"
      transition-show="fade"
      transition-duration="1.8"
      dark="true"
    >
      <div class="dialog_container">
        <q-card class="dialog_card">
          <q-card-section class="q-pt-none">
            <div class="text-body1 text-weight-regular">
              thank you
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </template>
</template>

<style scoped>

  .container-settings {
    padding: var(--px43);
  }

  .container-settings > *:not(:last-of-type) {
    margin-bottom: var(--px30);
  }
  .container-settings > *:last-of-type {
    margin-bottom: var(--px60);
  }
  .cart-product-item {
    width: 100%;
    height: max-content;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    padding: var(--px30);
  }
  .cart-product-item > *:first-of-type {
    margin-right: 2rem;
  }

  .order_container > span:not(:last-of-type) {
    margin-right: 1rem;
  }

  .dialog_container {
    width: 70vw;
    max-width: 80vw;
    height: max-content;
  }
</style>
