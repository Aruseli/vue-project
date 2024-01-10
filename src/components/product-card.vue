<script setup>
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { ionEllipse } from '@quasar/extras/ionicons-v6';
  import { evaRadioButtonOffOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { computed, ref, onMounted } from 'vue';
  import { useCartStore } from '../stores/cart';
  import { useGoodsStore } from '../stores/products';
  import { useAppStore } from 'src/stores/app';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const openDialog = ref(false);
  const slide = ref(0);

  const { t } = useI18n();

  const cartStore = useCartStore();
  const goodsStore = useGoodsStore();
  const app = useAppStore();

  const props = defineProps({
    images: {
      type: [String],
      required: false,
    },
    alt: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: false
    },
    stock: {
      type: Number,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    itemId: {
      type: Number,
    },
  })

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
          handler: () => app.openDrawerCart(true)
        },
      ]
    })
  }

  const selectedGood = computed(() => {
    return goodsStore.goods.find((item) => item.id === props.itemId);
  })

  const existGood = computed(() => {
    return cartStore.cart.find((item) => item.id === selectedGood.value.id);
  })

  const goodDetails = () => {
    openDialog.value = true;
  }

  const addGoodToCart = (selectedGood) => {
    cartStore.addToCart(selectedGood);
    showNotify();
    console.log('existGood', existGood.value.count)
    console.log('selectedGood', selectedGood)
    console.log('count', cartStore.cart)
  }

  const selectedCount = computed(() => {
    return cartStore.cart.find((item) => item.id === selectedGood.value.id);
  })


  const decrease = (selectedGood) => {
    cartStore.decreaseItemsCount(selectedGood);
    showNotify();
  }

  const increase = (selectedGood) => {
    cartStore.increaseItemsCount(selectedGood);
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
            :src="props.images[0]"
            :alt="props.alt"
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
            <div class="text-h4 text-weight-regular q-mb-sm ellipsis">
              {{ props.title }}
            </div>
            <div class="row no-wrap justify-between">
              <div class="text-subtitle2">
                {{ t('product_price') }}
              </div>
              <div class="text-h3">
                {{ props.price }}&ensp;&#3647
              </div>
            </div>
          </div>
        </div>

        <div class="text-body1 ellipsis-2-lines">
          {{ props.description }}
        </div>

        <q-btn @click="goodDetails">{{ $t('read') }}</q-btn>
      </div>

      <div>
        <q-btn v-if="!existGood"
          class="full-width text-style"
          unelevated
          rounded
          no-caps
          color="primary"
          text-color="white"
          size="xl"
          @click="addGoodToCart(selectedGood)"
          >
          <div class="text-center text-weight-bold text-subtitle1">
            {{ $t('add') }}
          </div>
        </q-btn>
        <div class="row justify-between items-center" v-else>
          <q-btn unelevated round @click="increase(existGood)">
            <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
          </q-btn>
          <div class="text-h4 q-ma-none">{{ existGood.count }}</div>
          <q-btn unelevated round @click="decrease(existGood)">
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
                v-for="(image, index) in selectedGood.images"
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
            <div class="text-h3 text-weight-regular">
              {{ selectedGood.title }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-tabs
              v-model="app.tabCharacteristics"
              narrow-indicator
              dense
              align="start"
            >
              <q-tab :ripple="false" name="description" :label="t('description')" />
              <q-tab :ripple="false" name="characteristics" :label="t('characteristics')" />
            </q-tabs>
            <q-tab-panels v-model="app.tabCharacteristics" animated swipeable class="fit">
              <q-tab-panel name="description" dark>
                <div class="text-body1 text-weight-regular">
                  {{ selectedGood.description }}
                </div>
              </q-tab-panel>
              <q-tab-panel name="characteristics" dark>
                <div class="text-body1 text-weight-regular">
                  {{ selectedGood.description }}
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
          <q-card-actions>
            <div class="full-width">
              <q-btn
                v-if="!existGood"
                class="full-width text_style"
                unelevated
                rounded
                no-caps
                color="primary"
                text-color="white"
                @click="addGoodToCart(selectedGood)"
                size="xl"
                >
                <div class="text-center text-weight-bold text-h3 text-white">
                  {{ $t('add') }}
                </div>
              </q-btn>
              <div class="row justify-between items-center" v-else>
                <q-btn unelevated round @click="increase(existGood)" size="xl">
                  <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
                </q-btn>
                <div class="text-h4 q-ma-none">{{ existGood.count }}</div>
                <q-btn unelevated round @click="decrease(existGood)" size="xl">
                  <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
                </q-btn>
              </div>
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
    height: 55rem;
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
