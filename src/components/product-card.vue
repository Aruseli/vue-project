<script setup>
  import { evaPlusOutline } from '@quasar/extras/eva-icons';
  import { evaMinusOutline } from '@quasar/extras/eva-icons';
  import { ionEllipse } from '@quasar/extras/ionicons-v6';
  import { evaRadioButtonOffOutline } from '@quasar/extras/eva-icons';
  import { useI18n } from 'vue-i18n';
  import { computed, ref, onMounted } from 'vue';
  import { productsStore } from 'src/stores/store.js';

  const text = ref(null);
  const openDialog = ref(false);
  const slide = ref(0);

  const { t } = useI18n();

  const store = productsStore();

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
    count: {
      type: Number,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    productId: {
      type: Number,
      required: false
    },
  })

  let size = ref(false);

  let mult = computed(() => {
    size = text.value.clientHeight < text.value.scrollHeight;
    return size;
  })

  onMounted(async() => {
    if (text.value.clientHeight < text.value.scrollHeight) {
      text.value.style.webkitLineClamp = '3';
      text.value.style.textOverflow = 'ellipsis';
      text.value.style.overflow = 'hidden';
      text.value.style.display = '-webkit-box';
      text.value.style.webkitBoxOrient = 'vertical';
    }
    console.log('size', size)
    return size;
  })

  const selectedProduct = computed(() => {
    return store.products.find((item) => item.id === props.productId);
  })

  const existProduct = computed(() => {
    return store.cart.filter(item => item.id == selectedProduct.value.id);
  })
  const countItems = computed(() => {
    let existProduct = store.cart.filter(item => item.id == selectedProduct.value.id) || null
    return existProduct
  })
  const productDetails = () => {
    openDialog.value = true;
    console.log('size', mult.value)
  }

</script>


<template>
  <div class="card_setting">
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
          <div class="text-h5 text-weight-regular q-mb-sm">
            {{ props.title }}
          </div>
          <div class="row no-wrap justify-between">
            <div class="text-subtitle1">
              {{ t('product_price') }}$
            </div>
            <div class="text-subtitle1">
              {{ props.price }}
            </div>
          </div>
        </div>
      </div>

      <div ref="text" class="text-body1" style="height: 6.5rem">
        {{ props.description }}
      </div>

      <q-btn  @click="productDetails">{{ $t('read') }}</q-btn>
    </div>

    <div>
      <q-btn v-if="existProduct.length === 0"
        class="full-width text-style"
        unelevated
        rounded
        no-caps
        color="primary"
        text-color="white"
        @click="store.addToCartAndIncrementCount(selectedProduct)"
        >
        <div class="text-center text-weight-bold text-subtitle1">
          {{ $t('add') }}
        </div>
      </q-btn>
      <div class="row justify-between items-center" v-else>
        <q-btn unelevated round @click="store.increaseItems(selectedProduct)">
          <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
        </q-btn>
        <h5 class="q-ma-none">{{ countItems[0].count }}</h5>
        <q-btn unelevated round @click="store.decreaseItems(selectedProduct)">
          <q-icon flat class="round-button-light_green" :name="evaMinusOutline"/>
        </q-btn>
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
                    style="width: calc(70vw - 8rem); height: calc(70vw - 8rem);"
                    :ration="1"
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
              <q-btn v-if="existProduct.length === 0"
                class="full-width text-style"
                unelevated
                rounded
                no-caps
                color="primary"
                text-color="white"
                @click="store.addToCartAndIncrementCount(selectedProduct)"
                >
                <div class="text-center text-weight-bold text-subtitle1">
                  {{ $t('add') }}
                </div>
              </q-btn>
              <div class="row justify-between items-center" v-else>
                <q-btn unelevated round @click="store.increaseItems(selectedProduct)">
                  <q-icon flat class="round-button-light_green" :name="evaPlusOutline"/>
                </q-btn>
                <h5 class="q-ma-none">{{ countItems[0].count }}</h5>
                <q-btn unelevated round @click="store.decreaseItems(selectedProduct)">
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
  font-weight: bold;
  width: max-content;
  max-width: calc(var(--width_coefficient) + var(--coefficient));
  min-height: 51rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.3rem;
}
.img_container {
  max-width: $calc_width;
  max-height: $calc_width;
  border-radius : var(--px30);
  overflow: hidden;
  margin-bottom: 2.5rem;
}

.content_container > *:nth-child(n+2){
  margin-bottom: 1.5rem;
}

.text-style {
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

  .custom-section {
    padding: 1rem 3.2rem;
  }
</style>
