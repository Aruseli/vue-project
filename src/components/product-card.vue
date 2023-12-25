<script setup>
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { ionEllipse } from '@quasar/extras/ionicons-v6';
  import { evaRadioButtonOffOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { computed, ref, onMounted } from 'vue';
  // import { productsStore } from 'src/stores/store.js';
  import { useCartStore } from '../stores/cart-store';
  import { useProductsStore } from '../stores/product-store';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const openDialog = ref(false);
  const slide = ref(0);

  const { t } = useI18n();

  const cartStore = useCartStore();
  const productsStore = useProductsStore();


  const props = defineProps({
    product: {
      type: Object,
      require: true,
      default: () => {},
    }
  })
  // const props = defineProps({
  //   images: {
  //     type: [String],
  //     required: false,
  //   },
  //   alt: {
  //     type: String,
  //     required: false
  //   },
  //   title: {
  //     type: String,
  //     required: false
  //   },
  //   price: {
  //     type: Number,
  //     required: false
  //   },
  //   count: {
  //     type: Number,
  //     required: false
  //   },
  //   description: {
  //     type: String,
  //     required: false
  //   },
  //   productId: {
  //     type: Number,
  //     required: false
  //   },
  // })

  const showNotify = () => {
    $q.notify({
      timeout: 3000,
      multiLine: true,
      classes: 'full-width',
      actions: [
        {
          label: t('placing_an_order'),
          color: 'white',
          'aria-label': 'Move to cart',
          handler: () => store.openDrawerCart(true)
        },
      ]
    })
  }

  const selectedProduct = computed(() => {
    return productsStore.products.find((item) => item.id === props.product.id);
  })

  const existProduct = computed(() => {
    return cartStore.cart.find(item => item.id === selectedProduct.id);
  })

  const productDetails = () => {
    openDialog.value = true;
  }

  const addProductToCart = (selectedProduct) => {
    productsStore.addToCartAndIncrementCount(selectedProduct);
    showNotify();
    console.log('selectedProduct.id', selectedProduct.id)
    console.log('cartStore.cart', cartStore.cart.find(item => item.id === selectedProduct.id))
    console.log('existProduct', existProduct == true)
  }

  const countItems = computed(() => {
    let exProduct = cartStore.cart.filter(item => item.id == selectedProduct.id) || null;
    return exProduct
  })

  const decrease = (selectedProduct) => {
    cartStore.decreaseItemsCount(selectedProduct);
    showNotify();
  }

  const increase = (selectedProduct) => {
    cartStore.increaseItemsCount(selectedProduct);
    showNotify();
  }

  // const unavailable = computed(() => {
  //   return store.products.find((item) => item.stock < 37);
  // })

  // onMounted(async() => {
  //   await  console.log('123', store.products.find(item => item.stock < 37));
  // })

</script>


<template>
  <div class="card_setting">
    <div
      style="filter: unavailable ? contrast(0.2) : none; cursor: not-allowed"
    >
      <div class="content_container">
        <div class="img_container">
          <q-img
            :src="product.images[0]"
            :alt="product.alt"
            ratio="1"
          >
            <template #loading>
              <div class="text-subtitle1 text-black">
                Loading...
              </div>
            </template>
          </q-img>
        </div>
        <div>
          <div class="column no-wrap items-left">
            <div class="text-h5 text-weight-regular q-mb-sm ellipsis">
              {{ product.title }}
            </div>
            <div class="row no-wrap justify-between">
              <div class="text-subtitle1">
                {{ t('product_price') }}
              </div>
              <div class="text-subtitle1">
                {{ product.price }}&ensp;THB
              </div>
            </div>
          </div>
        </div>

        <div class="text-body1 ellipsis-2-lines">
          {{ product.description }}
        </div>

        <q-btn  @click="productDetails">{{ $t('read') }}</q-btn>
      </div>

      <div>
        <q-btn v-if="!existProduct"
          class="full-width text-style"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          size="xl"
          @click="addProductToCart(selectedProduct)"
          >
          <div class="text-center text-weight-bold text-subtitle1">
            {{ $t('add') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <q-btn unelevated round @click="increase(selectedProduct)">
            <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
          </q-btn>
          <h5 class="q-ma-none">{{ countItems }}</h5>
          <q-btn unelevated round @click="decrease(selectedProduct)">
            <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
          </q-btn>
        </div>
      </div>
    </div>
  </div>

  <template>
    <q-dialog
      v-model="openDialog"
      transition-hide="fade"
      transition-show="fade"
      transition-duration="1.8"
      dark="true"
    >
      <div class="dialog_container">
        <q-card class="dialog_card">
          <q-card-section>
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
              padding
              class="bg-transparent round-borders fit"
            >
              <q-carousel-slide
                v-for="(image, index) in selectedProduct.images"
                :key="index"
                :name="index"
                class="column no-wrap flex-center"
              >
                <div>
                  <q-img
                    :src="image"
                    ration="1"
                    style="width: calc(70vw - 8rem); height: calc(70vw - 8rem);"
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
          </q-card-section>
          <q-card-section>
            <div class="text-h5 text-weight-regular">
              {{ selectedProduct.title }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-body1 text-weight-regular">
              {{ selectedProduct.description }}
            </div>
          </q-card-section>
          <q-card-actions>
            <div class="full-width">
              <q-btn
                class="full-width text_style"
                unelevated
                rounded
                no-caps
                color="primary"
                text-color="white"
                @click="productsStore.addToCartAndIncrementCount(selectedProduct)"
                >
                <div class="text-center text-weight-bold text-subtitle1">
                  {{ $t('add') }}
                </div>
              </q-btn>
              <!-- <div class="row justify-between items-center" v-else>
                <q-btn unelevated round @click="cartStore.increaseItems(selectedProduct)" size="xl">
                  <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
                </q-btn>
                <h5 class="q-ma-none">{{ countItems[0].count }}</h5>
                <q-btn unelevated round @click="cartStore.decreaseItems(selectedProduct)" size="xl">
                  <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
                </q-btn>
              </div> -->
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </template>

</template>

<style lang="scss" scoped>
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));

  .card_setting {
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    width: max-content;
    max-width: calc(var(--width_coefficient) + var(--coefficient));
    min-height: 53rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.3rem;
    background-color: var(--q-header_bg);
  }
  .img_container {
    max-width: $calc_width;
    max-height: $calc_width;
    border-radius : var(--px30);
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .content_container > *:nth-child(n+2){
    margin-bottom: 1.5rem;
  }

  .text_style {
    font-weight: bold;
  }

  .dialog_container {
    width: 70vw;
    max-width: 80vw;
    height: max-content;
  }

  .button-close-dialog {
    /* position: absolute; */
    /* right: 0 */
  }

</style>
